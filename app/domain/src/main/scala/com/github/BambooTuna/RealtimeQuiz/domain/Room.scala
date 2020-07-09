package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.stream.{KillSwitches, Materializer, SharedKillSwitch}
import akka.stream.scaladsl.{Flow, Sink}
import com.github.BambooTuna.RealtimeQuiz.domain.ws._

import scala.concurrent.Future
import scala.util.Try

case class Room(roomId: String,
                var parent: Account,
                private val roomConnection: RoomConnection)(
    implicit materializer: Materializer)
    extends QuizSupport {

  def join(accountId: String, accountName: String): Try[Unit] = Try {
    require(children.size < 10, "満員です >= 10")

    if (isParent(accountId)) {
      println("あなたは親です")
    } else if (isChild(accountId)) {
      println("既に参加済み")
    } else {
      this.children = this.children + Account.create(accountId, accountName)
    }
  }

  def getConnection(accountId: String)
    : Try[Flow[WebSocketMessage, WebSocketMessage, NotUsed]] = Try {
    if (isParent(accountId)) parentConnection(this.parent)
    else if (isChild(accountId))
      this.children.find(_.accountId == accountId).map(childConnection).get
    else throw new Exception("403")
  }

  def leave(account: Account): Try[Unit] = Try {
    this.children = this.children + account
  }

  def changeName(account: Account): Try[Unit] = Try {
    this.children = this.children - account + account
  }

  private def receiveMessageFlow(account: Account)
    : Flow[WebSocketMessage, WebSocketMessageWithDestination, NotUsed] = {
    Flow[WebSocketMessage].map {
      case a: ParseError       => a.addDestination(None)
      case a: ConnectionOpened => a.addDestination(None)
      case a: ConnectionClosed => a.addDestination(None)
      case a: Quiz =>
        setQuiz(account.accountId, a)
        a.addDestination(Children)
      case a: Answer =>
        println(s"Answer: ${a}")
        writeAnswer(account.accountId, a)
        a.addDestination(Parent)
      case a: CorrectAnswer =>
        // TODO
        a.addDestination(None)
      case a: ReName =>
        ConnectionOpened(account.accountId, a.name).addDestination(All)
    }
  }

  private def parentConnection(
      account: Account): Flow[WebSocketMessage, WebSocketMessage, NotUsed] = {
    firstConnect(account)
    val killSwitch: SharedKillSwitch = KillSwitches.shared(roomId)
    Flow.fromSinkAndSource(
      receiveMessageFlow(account) to Sink.actorRef(
        this.roomConnection.actorRef,
        ConnectionClosed(account.accountId, account.name).addDestination(All)),
      this.roomConnection.source via closeWatchFlow(killSwitch) via Flow[
        WebSocketMessageWithDestination]
        .filter(
          _.destination match {
            case All               => true
            case Parent            => true
            case Children          => false
            case Users(accountIds) => accountIds.contains(account.accountId)
            case User(accountId)   => accountId == account.accountId
            case None              => false
          }
        )
        .map(_.message)
    ) via killSwitch.flow
  }
  private def childConnection(
      account: Account): Flow[WebSocketMessage, WebSocketMessage, NotUsed] = {
    firstConnect(account)
    val killSwitch: SharedKillSwitch = KillSwitches.shared(roomId)
    Flow.fromSinkAndSource(
      receiveMessageFlow(account) to Sink.actorRef(
        this.roomConnection.actorRef,
        ConnectionClosed(account.accountId, account.name).addDestination(All)),
      this.roomConnection.source via closeWatchFlow(killSwitch) via Flow[
        WebSocketMessageWithDestination]
        .filter(
          _.destination match {
            case All               => true
            case Parent            => false
            case Children          => true
            case Users(accountIds) => accountIds.contains(account.accountId)
            case User(accountId)   => accountId == account.accountId
            case None              => false
          }
        )
        .map(_.message)
    ) via killSwitch.flow
  }

  private def closeWatchFlow(
      killSwitch: SharedKillSwitch): Flow[WebSocketMessageWithDestination,
                                          WebSocketMessageWithDestination,
                                          NotUsed] = {
    Flow[WebSocketMessageWithDestination].map {
      case WebSocketMessageWithDestination(ConnectionClosed(accountId, name),
                                           d) =>
        if (isParent(accountId)) killSwitch.shutdown()
        WebSocketMessageWithDestination(ConnectionClosed(accountId, name), d)
      case other => other
    }
  }

  def firstConnect(account: Account): Unit = {
    Future {
      Thread.sleep(1000)

      this.roomConnection.actorRef ! ConnectionOpened(
        account.accountId,
        account.name).addDestination(All)
      quiz.foreach(
        a =>
          this.roomConnection.actorRef ! a.addDestination(
            User(account.accountId)))

      if (isParent(account.accountId)) {
        this.children.foreach(
          a =>
            this.roomConnection.actorRef ! ConnectionOpened(a.accountId, a.name)
              .addDestination(User(account.accountId)))
      } else if (isChild(account.accountId)) {
        this.roomConnection.actorRef ! TemporaryData(
          account.answer.content,
          account.points).addDestination(User(account.accountId))
        this.children
          .filterNot(_.accountId == account.accountId)
          .foreach(a =>
            this.roomConnection.actorRef ! ConnectionOpened(a.accountId, a.name)
              .addDestination(User(account.accountId)))
      }

    }(materializer.executionContext)
  }

}

object Room {
  def create(account: Account)(implicit materializer: Materializer): Room = {
    val roomId = java.util.UUID.randomUUID.toString.replaceAll("-", "")
    Room(roomId, account, RoomConnection.create(roomId))
  }

  def create(roomId: String, account: Account)(
      implicit materializer: Materializer): Room = {
    Room(roomId, account, RoomConnection.create(roomId))
  }
}
