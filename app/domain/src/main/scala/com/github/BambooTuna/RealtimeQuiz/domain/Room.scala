package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.{KillSwitches, Materializer, SharedKillSwitch}
import akka.stream.scaladsl.{Flow, Sink}
import com.github.BambooTuna.RealtimeQuiz.domain.ws.{
  ConnectionClosed,
  ConnectionOpened,
  WebSocketMessage,
  WebSocketMessageWithSender
}

import scala.util.Try

case class Room(roomId: String,
                parent: Account,
                private val roomConnection: RoomConnection) {
  var children: Set[Account] = Set.empty

  def isParent(account: Account): Boolean = this.parent == account
  def isParent(accountId: String): Boolean =
    this.parent == Account(accountId, "_")
  def isChild(account: Account): Boolean = this.children.contains(account)
  def isChild(accountId: String): Boolean =
    this.children.contains(Account(accountId, "_"))

  def join(account: Account): Try[Room] = Try {
    require(children.size < 10, "満員です >= 10")
    if (isParent(account)) {
      throw new Exception("あなたは親です")
    } else if (isChild(account)) {
      throw new Exception("既に参加済み")
    } else {
      this.children = this.children + account
      this
    }
  }

  def getConnection(account: Account)
    : Try[Flow[WebSocketMessage, WebSocketMessageWithSender, NotUsed]] = Try {
    if (isParent(account)) parentConnection(account)
    else if (isChild(account)) childConnection(account)
    else throw new Exception("403")
  }

  def leave(account: Account): Try[Room] = Try {
    this.children = this.children + account
    this
  }

  def changeName(account: Account): Try[Room] = Try {
    this.children = this.children - account + account
    this
  }

  private def parentConnection(account: Account)
    : Flow[WebSocketMessage, WebSocketMessageWithSender, NotUsed] = {
    this.roomConnection.actorRef ! ConnectionOpened(account.accountId,
                                                    account.name)
      .addSender(account)
    Flow.fromSinkAndSource(
      Flow[WebSocketMessage].map(_.addSender(account)) to Sink.actorRef(
        this.roomConnection.actorRef,
        ConnectionClosed(account.accountId).addSender(account)),
      this.roomConnection.source via closeWatchFlow(KillSwitches.shared(roomId)) via Flow[
        WebSocketMessageWithSender]
        .filter(a => isChild(a.from))
    )
  }
  private def childConnection(account: Account)
    : Flow[WebSocketMessage, WebSocketMessageWithSender, NotUsed] = {
    this.roomConnection.actorRef ! ConnectionOpened(account.accountId,
                                                    account.name)
      .addSender(account)
    Flow.fromSinkAndSource(
      Flow[WebSocketMessage].map(_.addSender(account)) to Sink.actorRef(
        this.roomConnection.actorRef,
        ConnectionClosed(account.accountId).addSender(account)),
      this.roomConnection.source via closeWatchFlow(KillSwitches.shared(roomId)) via Flow[
        WebSocketMessageWithSender]
        .filter(a => isParent(a.from))
    )
  }

  private def closeWatchFlow(killSwitch: SharedKillSwitch)
    : Flow[WebSocketMessageWithSender, WebSocketMessageWithSender, NotUsed] = {
    Flow[WebSocketMessageWithSender].map {
      case WebSocketMessageWithSender(ConnectionClosed(accountId), from) =>
        if (isParent(accountId)) killSwitch.shutdown()
        WebSocketMessageWithSender(ConnectionClosed(accountId), from)
      case other => other
    }
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
