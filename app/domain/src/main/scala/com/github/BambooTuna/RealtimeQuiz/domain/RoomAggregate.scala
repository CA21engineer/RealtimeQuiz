package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.actor.Actor
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Flow
import com.github.BambooTuna.RealtimeQuiz.domain.RoomAggregate.Protocol._
import com.github.BambooTuna.RealtimeQuiz.domain.ws.WebSocketMessage

import scala.util.{Failure, Success, Try}

class RoomAggregate extends Actor {
  implicit val materializer: ActorMaterializer = ActorMaterializer()

  val debugRoom =
    Room.create("debugRoomId", Account.create("admin", "I'm admin"))
  val rooms: scala.collection.mutable.Map[String, Room] =
    scala.collection.mutable.Map(debugRoom.roomId -> debugRoom)

  override def receive: Receive = {
    case GetRoomsRequest =>
      sender() ! GetRoomsSuccess(rooms.values.toSeq)
    case r: CreateRoomRequest =>
      createNewRoom(r) match {
        case Failure(exception) =>
          sender() ! CreateRoomFailure(exception.getMessage)
        case Success(value) => sender() ! CreateRoomSuccess(value)
      }
    case r: JoinRoomRequest =>
      joinRoom(r) match {
        case Failure(exception) =>
          sender() ! JoinRoomFailure(exception.getMessage)
        case Success(value) => sender() ! JoinRoomSuccess(value)
      }
    case r: LeaveRoomRequest  => leaveRoom(r)
    case r: RemoveRoomRequest => removeRoom(r)
    case other                => println(other.toString)
  }

  def createNewRoom(request: CreateRoomRequest): Try[String] = Try {
    val room = Room.create(request.account)
    require(!this.rooms.contains(room.roomId))
    this.rooms += (room.roomId -> room)
    room.roomId
  }

  def joinRoom(request: JoinRoomRequest)
    : Try[Flow[WebSocketMessage, WebSocketMessage, NotUsed]] = {
    this.rooms.get(request.roomId) match {
      case Some(value) =>
        value
          .join(request.accountId, request.accountName) match {
          case Failure(_) => value.getConnection(request.accountId)
          case Success(_) => value.getConnection(request.accountId)
        }
      case scala.None => Failure(new Exception("ルームが見つかりません"))
    }
  }

  def leaveRoom(request: LeaveRoomRequest): Try[Unit] = {
    this.rooms.get(request.roomId) match {
      case Some(value) => value.leave(request.account)
      case scala.None  => Failure(new Exception("ルームが見つかりません"))
    }
  }

  def removeRoom(request: RemoveRoomRequest): Unit = {
    this.rooms
      .get(request.roomId)
      .filter(_.parent.accountId == request.accountId)
      .foreach(_ => {
        println(s"RemoveRoomRequest: ${request.roomId}")
        this.rooms.remove(request.roomId)
      })
  }
}

object RoomAggregate {
  val name = "RoomAggregate"

  object Protocol {
    case object GetRoomsRequest
    case class GetRoomsSuccess(rooms: Seq[Room])

    case class CreateRoomRequest(account: Account)
    sealed trait CreateRoomResponse
    case class CreateRoomSuccess(roomId: String) extends CreateRoomResponse
    case class CreateRoomFailure(message: String) extends CreateRoomResponse

    case class JoinRoomRequest(roomId: String,
                               accountId: String,
                               accountName: String)
    sealed trait JoinRoomResponse
    case class JoinRoomSuccess(
        connection: Flow[WebSocketMessage, WebSocketMessage, NotUsed])
        extends JoinRoomResponse
    case class JoinRoomFailure(message: String) extends JoinRoomResponse

    case class LeaveRoomRequest(roomId: String, account: Account)

    case class RemoveRoomRequest(accountId: String, roomId: String)

  }

}
