package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.actor.Actor
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Flow
import com.github.BambooTuna.RealtimeQuiz.domain.RoomAggregate.Protocol._
import com.github.BambooTuna.RealtimeQuiz.domain.ws.{
  WebSocketMessage,
  WebSocketMessageWithSender
}

import scala.util.{Failure, Success, Try}

class RoomAggregate extends Actor {
  implicit val materializer: ActorMaterializer = ActorMaterializer()

  val debugRoom = Room.create("debugRoomId", Account("admin", "I'm admin"))
  val rooms: scala.collection.mutable.Map[String, Room] =
    scala.collection.mutable.Map(debugRoom.roomId -> debugRoom)

  override def receive: Receive = {
    case GetRoomsRequest =>
      sender() ! GetRoomsSuccess(rooms.values.map(_.roomId).toSeq)
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
    case r: LeaveRoomRequest => leaveRoom(r)
    case other               => println(other.toString)
  }

  def createNewRoom(request: CreateRoomRequest): Try[String] = Try {
    val room = Room.create(request.account)
    require(!this.rooms.contains(room.roomId))
    this.rooms += (room.roomId -> room)
    room.roomId
  }

  def joinRoom(request: JoinRoomRequest)
    : Try[Flow[WebSocketMessage, WebSocketMessageWithSender, NotUsed]] = {
    this.rooms.get(request.roomId) match {
      case Some(value) =>
        value
          .join(request.account) match {
          case Failure(_) => value.getConnection(request.account)
          case Success(room) =>
            this.rooms.update(room.roomId, room)
            room.getConnection(request.account)
        }
      case None => Failure(new Exception("ルームが見つかりません"))
    }
  }

  def leaveRoom(request: LeaveRoomRequest): Try[Unit] = {
    this.rooms.get(request.roomId) match {
      case Some(value) =>
        value.leave(request.account).map(r => this.rooms.update(r.roomId, r))
      case None => Failure(new Exception("ルームが見つかりません"))
    }
  }
}

object RoomAggregate {
  val name = "RoomAggregate"

  object Protocol {
    case object GetRoomsRequest
    case class GetRoomsSuccess(rooms: Seq[String])

    case class CreateRoomRequest(account: Account)
    sealed trait CreateRoomResponse
    case class CreateRoomSuccess(roomId: String) extends CreateRoomResponse
    case class CreateRoomFailure(message: String) extends CreateRoomResponse

    case class JoinRoomRequest(roomId: String, account: Account)
    sealed trait JoinRoomResponse
    case class JoinRoomSuccess(
        connection: Flow[WebSocketMessage, WebSocketMessageWithSender, NotUsed])
        extends JoinRoomResponse
    case class JoinRoomFailure(message: String) extends JoinRoomResponse

    case class LeaveRoomRequest(roomId: String, account: Account)

  }

}
