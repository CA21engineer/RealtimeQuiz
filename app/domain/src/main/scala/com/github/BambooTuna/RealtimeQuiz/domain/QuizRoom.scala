package com.github.BambooTuna.RealtimeQuiz.domain

import akka.{Done, NotUsed}
import akka.stream.{KillSwitches, Materializer, SharedKillSwitch}
import akka.stream.scaladsl.{Flow, Sink, Source}
import com.evolutiongaming.metrics.MetricCollectors
import com.github.BambooTuna.RealtimeQuiz.domain.AccountRole.{Admin, Player, Spectator}
import com.github.BambooTuna.RealtimeQuiz.domain.ConnectionStatus.Online
import com.github.BambooTuna.RealtimeQuiz.domain.CurrentStatus.{CloseAnswer, OpenAggregate, OpenAnswer, WaitingAnswer, WaitingQuestion}
import com.github.BambooTuna.RealtimeQuiz.domain.lib.StreamSupport
import com.github.BambooTuna.RealtimeQuiz.domain.ws._
import org.slf4j.{Logger, LoggerFactory}

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContextExecutor, Future}
import scala.util.Try

abstract class QuizRoom(val roomId: String, val roomName: String)(
    implicit materializer: Materializer) {
  implicit val executionContext: ExecutionContextExecutor =
    materializer.executionContext

  val logger: Logger = LoggerFactory.getLogger(getClass)

  var parent: Account
  protected var children: Set[Account] = Set.empty
  def participants: Int = children.count(_.role == Player)
  var currentStatus: CurrentStatus = WaitingQuestion
  var currentQuestion: Option[Question] = None
  var elapsedTime: Int = 0
  Source.repeat(1).throttle(1, 1.seconds).runForeach(_ => elapsedTime += 1)

  protected val killSwitch: SharedKillSwitch = KillSwitches.shared(roomId)
  protected val (actorRef, source) = StreamSupport
    .actorSourceWithKillSwitch[WebSocketMessageWithDestination](killSwitch,
                                                                setIgnoreSink =
                                                                  false)

  protected def isParent(id: String): Boolean = this.parent.id == id
  protected def isChild(id: String): Boolean = this.children.exists(_.id == id)
  protected def canAnswer(id: String): Boolean =
    this.children.exists(a => a.id == id && a.role == Player && !a.isAnswered)

  var isClosed: Boolean = false
  val timer = materializer.schedulePeriodically(1.minutes, 1.minutes, () => { if (online == 0) isClosed = true })
  def online: Int = {
    val everyone = this.children + parent
    everyone.count(_.connectionStatus == Online)
  }

  def join(accountId: String, isSpectator: Boolean): Try[Unit] = Try {
    require(children.size < 1000, "満員です >= 1000")
    val role = if (isSpectator) Spectator else Player
    if (!isParent(accountId) && !isChild(accountId)) {
      this.children = this.children + Account.apply(accountId, role)
    } else if (isChild(accountId)) {
      changeAccountStatus(accountId, _.changeRole(role))
    }
  }

  def leave(accountId: String): Try[Unit] = Try {
    changeAccountStatus(accountId, _.leave)
  }

  def closable(accountId: String): Boolean = {
    val r = isParent(accountId)
    if (r) killSwitch.shutdown()
    r
  }

  def close(): Unit = {
    logger.info(s"Room($roomId) closed")
    killSwitch.shutdown()
    timer.cancel()
  }

  def getConnection(accountId: String)
    : Try[Flow[WebSocketMessage, WebSocketMessage, NotUsed]] = Try {
    changeAccountStatus(accountId, _.activate)
    noticeEveryone()
    Flow
      .fromSinkAndSource(
        sink(accountId).mapMaterializedValue(_.onComplete { _ =>
          leave(accountId)
          noticeEveryone()
        // actorRef ! WebSocketMessage.connectionClosed(accountId)
        }),
        source via destinationFilterFlow(accountId)
      )
  }

  protected def noticeEveryone(): Future[Unit] = {
    Future {
      Thread.sleep(500)
      noticePlayersState(actorRef ! _)
    }
  }

  protected def changeQuizRoomStatus(f: QuizRoom => Unit): Unit = {
    f(this)
  }
  protected def changeAccountStatus(accountId: String,
                                    f: Account => Account): Unit = {
    if (isParent(accountId)) this.parent = f(this.parent)
    children
      .find(_.id == accountId)
      .map(f)
      .foreach { account =>
        this.children = this.children.filterNot(_.id == account.id) + account
      }
  }

  protected def noticePlayersState(
      f: WebSocketMessageWithDestination => Unit): Unit = {
    val everyone = this.children + parent
    val playerList =
      PlayerList(
        currentStatus = currentStatus,
        currentQuestion = currentQuestion.map(_.problemStatement),
        currentCorrectAnswer = currentQuestion.flatMap(_.correctAnswer),
        currentTime = currentQuestion.flatMap(_.timeLimit.map { t =>
          val r = t - elapsedTime
          if (r < 0) 0 else r
        }),
        players = everyone.toSeq
      )

    f(
      WebSocketMessageWithDestination(playerList.fetch(isParent = true),
                                      User(this.parent.id)))
    f(
      WebSocketMessageWithDestination(playerList.fetch(isParent = false),
                                      Users(this.children.map(_.id).toSeq)))
  }

  protected def destinationFilterFlow(accountId: String)
    : Flow[WebSocketMessageWithDestination, WebSocketMessage, NotUsed] =
    Flow[WebSocketMessageWithDestination]
      .filter(_.destination.accessible(accountId))
      .map(_.data)

  protected def sink(accountId: String): Sink[WebSocketMessage, Future[Done]] =
    Sink.foreach[WebSocketMessage] {
      case v: ParseError =>
        logger.error(s"RoomId -> $roomId, $v")
      case v: PlayerList =>
        logger.debug(s"RoomId -> $roomId, $v")
      case v: ConnectionClosed =>
        //TODO connection close
        logger.debug(s"RoomId -> $roomId, $v")
      case v: ChangeName =>
        changeAccountStatus(accountId, _.rename(v.accountName))
        noticeEveryone()
      case v: SetQuestion =>
        if (isParent(accountId) && v.question.nonEmpty && this.currentStatus == WaitingQuestion) {
          changeQuizRoomStatus(_ => {
            this.currentStatus = this.currentStatus.next
            this.currentQuestion =
              Some(Question(v.question, v.correctAnswer, v.timeLimit))
            //TODO タイマーをセットし一定時間後にforceSendAnswerを全員に送信
            v.timeLimit.foreach { t =>
              Future {
                this.elapsedTime = 0
                Thread.sleep(t * 1000)
                actorRef ! WebSocketMessageWithDestination(
                  ForceSendAnswer(),
                  Users(this.children.map(_.id).toSeq))
                if (this.currentStatus == WaitingAnswer) this.currentStatus = this.currentStatus.next
              }.flatMap(_ => noticeEveryone())
            }
          })
          noticeEveryone()
        }
      case v: SetAnswer =>
        if (canAnswer(accountId) && (this.currentStatus == WaitingAnswer || this.currentStatus == CloseAnswer)) {
          changeAccountStatus(accountId, _.setAnswer(v.answer))
          noticeEveryone()
        }
      case CloseApplications =>
        if (this.currentStatus == WaitingAnswer) {
          //TODO send children ForceSendAnswer
          actorRef ! WebSocketMessageWithDestination(
            ForceSendAnswer(),
            Users(this.children.map(_.id).toSeq))
          this.currentStatus = this.currentStatus.next
          noticeEveryone()
        }
      case OpenAnswers =>
        if (this.currentStatus == CloseAnswer) {
          this.currentStatus = this.currentStatus.next
          noticeEveryone()
        }
      case v: SetAlterStars =>
        if (isParent(accountId) && (this.currentStatus == WaitingAnswer || this.currentStatus == CloseAnswer || this.currentStatus == OpenAnswer)) {
          v.alterStars.foreach(
            alterStar =>
              changeAccountStatus(alterStar.accountId,
                                  _.checkAnswer(_ => alterStar.alterStars)))
          noticeEveryone()
        }
      case GoToResult =>
        if (isParent(accountId) && this.currentStatus == OpenAnswer) {
          this.currentStatus = this.currentStatus.next
          this.children.foreach(account =>
            changeAccountStatus(account.id, _.reflectTheStars))
          noticeEveryone()
        }
      case GoToNextQuestion =>
        if (isParent(accountId) && this.currentStatus == OpenAggregate) {
          this.currentStatus = this.currentStatus.next
          this.currentQuestion = None
          this.children.foreach(account =>
            changeAccountStatus(account.id, _.init()))
          noticeEveryone()
        }
      case other =>
        logger.info(s"RoomId -> $roomId, $other")
    }
}

object QuizRoom {

  def apply(accountId: String, roomName: String)(
      implicit materializer: Materializer,
      collectors: MetricCollectors): QuizRoom = {
    val roomId = java.util.UUID.randomUUID.toString.replaceAll("-", "")
    new QuizRoom(roomId, roomName)(materializer) {
      override var parent: Account = Account.apply(accountId, Admin)
    }
  }

  def apply(accountId: String, roomId: String, roomName: String)(
      implicit materializer: Materializer,
      collectors: MetricCollectors): QuizRoom = {
    new QuizRoom(roomId, roomName)(materializer) {
      override var parent: Account = Account.apply(accountId, Admin)
    }
  }
}
