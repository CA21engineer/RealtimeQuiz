package com.github.BambooTuna.RealtimeQuiz.domain

import akka.{Done, NotUsed}
import akka.stream.Materializer
import akka.stream.scaladsl.{Flow, Sink}
import com.github.BambooTuna.RealtimeQuiz.domain.AccountRole.{Admin, Player}
import com.github.BambooTuna.RealtimeQuiz.domain.CurrentStatus.WaitingQuestion
import com.github.BambooTuna.RealtimeQuiz.domain.lib.StreamSupport
import com.github.BambooTuna.RealtimeQuiz.domain.ws.{
  ConnectionClosed,
  ParseError,
  PlayerList,
  WebSocketMessage,
  WebSocketMessageWithDestination
}
import org.slf4j.{Logger, LoggerFactory}

import scala.concurrent.Future
import scala.util.Try

abstract class QuizRoom(val roomId: String, val roomName: String)(
    implicit materializer: Materializer) {
  val logger: Logger = LoggerFactory.getLogger(getClass)

  var parent: Account
  var children: Set[Account] = Set.empty
  var currentStatus: CurrentStatus = WaitingQuestion
  var currentQuestion: Option[String] = None

  protected val (actorRef, source) = StreamSupport
    .actorSource[WebSocketMessageWithDestination](setIgnoreSink = false)

  protected def isParent(id: String): Boolean = this.parent.id == id
  protected def isChild(id: String): Boolean = this.children.exists(_.id == id)

  def join(accountId: String): Try[Unit] = Try {
    require(children.size < 10, "満員です >= 10")
    if (!isParent(accountId) && !isChild(accountId)) {
      this.children = this.children + Account.apply(accountId, Player)
    }
  }

  def leave(accountId: String): Try[Unit] = Try {
    //TODO leave room
    changeAccountStatus(accountId, _.leave)
  }

  def closable(accountId: String): Boolean = {
    //TODO close room
    false
  }

  def getConnection(accountId: String)
    : Try[Flow[WebSocketMessage, WebSocketMessage, NotUsed]] = Try {
    changeAccountStatus(accountId, _.activate)
    Flow
      .fromSinkAndSource(sink(accountId),
                         source via destinationFilterFlow(accountId))
      .watchTermination()((_, f) => {
        f.onComplete(_ =>
          actorRef ! WebSocketMessage.connectionClosed(accountId))(
          materializer.executionContext); NotUsed
      })
  }

  protected def changeAccountStatus(accountId: String,
                                    f: Account => Account): Unit = {
    children
      .find(_.id == accountId)
      .map(f)
      .foreach { account =>
        this.children = this.children - account + account
        //TODO Notice everyone
        Future {
          Thread.sleep(2000)
          noticePlayersState(actorRef ! _)
        }(materializer.executionContext)
      }
  }

  protected def noticePlayersState(
      f: WebSocketMessageWithDestination => Unit): Unit = {
    val everyone = this.children + parent
    f(
      WebSocketMessageWithDestination(
        PlayerList(
          currentStatus = currentStatus,
          currentQuestion = currentQuestion,
          currentTimeLimit = None,
          players = everyone.toSeq
        ),
        User(this.parent.id)
      )
    )

    f(
      WebSocketMessageWithDestination(
        PlayerList(
          currentStatus = currentStatus,
          currentQuestion = currentQuestion,
          currentTimeLimit = None,
          players = everyone.map(_.hideAnswer).toSeq
        ),
        Users(this.children.map(_.id).toSeq)
      )
    )
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
        logger.debug(s"RoomId -> $roomId, $v")
      case other =>
        logger.info(s"RoomId -> $roomId, $other")
    }
//  def changeName(accountId: String, accountName: String): Unit = {
//    changeAccountStatus(accountId, _.rename(accountName))
//  }
}

object QuizRoom {

  def apply(accountId: String, roomName: String)(
      implicit materializer: Materializer): QuizRoom = {
    val roomId = java.util.UUID.randomUUID.toString.replaceAll("-", "")
    new QuizRoom(roomId, roomName)(materializer) {
      override var parent: Account = Account.apply(accountId, Admin)
    }
  }

  def apply(accountId: String, roomId: String, roomName: String)(
      implicit materializer: Materializer): QuizRoom = {
    new QuizRoom(roomId, roomName)(materializer) {
      override var parent: Account = Account.apply(accountId, Admin)
    }
  }
}
