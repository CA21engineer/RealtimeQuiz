package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.{KillSwitches, Materializer, SharedKillSwitch}
import akka.stream.scaladsl.Flow

import scala.util.Try

case class Room(roomId: String,
                parent: Account,
                children: Set[Account],
                private val roomConnection: RoomConnection) {
  require(children.size <= 10, "満員です > 10")

  def isParent(account: Account): Boolean = this.parent == account
  def isChild(account: Account): Boolean = this.children.contains(account)

  def join(account: Account): Try[Room] = Try {
    if (isParent(account)) {
      throw new Exception("あなたは親です")
    } else if (isChild(account)) {
      throw new Exception("既に参加済み")
    } else {
      copy(children = this.children + account)
    }
  }

  def getConnection(account: Account): Try[RoomConnection] = Try {
    if (isParent(account)) parentConnection(account)
    else if (isChild(account)) childConnection(account)
    else throw new Exception("403")
  }

  def leave(account: Account): Try[Room] = Try {
    copy(children = this.children - account)
  }

  def changeName(account: Account): Try[Room] = Try {
    copy(children = this.children - account + account)
  }

  private def parentConnection(account: Account): RoomConnection = {
    this.roomConnection
      .copy(
        sink = Flow[Message].map {
          case TextMessage.Strict(message) =>
            TextMessage.Strict(s"From Parent(${account.accountId}): $message")
        } to this.roomConnection.sink,
        source = this.roomConnection.source via closeWatchFlow(
          KillSwitches.shared(roomId)) via Flow[Message].filter {
          case TextMessage.Strict(m) => m.contains("Child")
        }
      )
  }
  private def childConnection(account: Account): RoomConnection = {
    this.roomConnection
      .copy(
        sink = Flow[Message].map {
          case TextMessage.Strict(message) =>
            TextMessage.Strict(s"From Child(${account.accountId}): $message")
        } to this.roomConnection.sink,
        source = this.roomConnection.source via Flow[Message].filter {
          case TextMessage.Strict(m) => m.contains("Parent")
        }
      )
  }

  private def closeWatchFlow(
      killSwitch: SharedKillSwitch): Flow[Message, Message, NotUsed] = {
    Flow[Message].map {
      case TextMessage.Strict("ConnectionClosed") =>
        killSwitch.shutdown()
        TextMessage.Strict("ConnectionClosed")
      case other => other
    }
  }

}

object Room {
  def create(account: Account)(implicit materializer: Materializer): Room = {
    val roomId = java.util.UUID.randomUUID.toString.replaceAll("-", "")
    Room(roomId, account, Set.empty, RoomConnection.create(roomId))
  }

  def create(roomId: String, account: Account)(
      implicit materializer: Materializer): Room = {
    Room(roomId, account, Set.empty, RoomConnection.create(roomId))
  }
}
