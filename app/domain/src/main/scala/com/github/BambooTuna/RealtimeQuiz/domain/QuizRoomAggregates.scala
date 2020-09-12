package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.actor.Actor
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Flow
import com.evolutiongaming.metrics.MetricCollectors
import com.github.BambooTuna.RealtimeQuiz.domain.QuizRoomAggregates.Protocol._
import com.github.BambooTuna.RealtimeQuiz.domain.ws.WebSocketMessage

import scala.util.{Failure, Success, Try}

class QuizRoomAggregates(implicit collectors: MetricCollectors) extends Actor {
  implicit val materializer: ActorMaterializer = ActorMaterializer()

  val debugRoom =
    QuizRoom.apply("admin", "DebugRoom", "DebugRoom")
  val rooms: scala.collection.mutable.Map[String, QuizRoom] =
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
    val room = QuizRoom.apply(request.accountId, request.roomName)
    require(!this.rooms.contains(room.roomId))
    this.rooms += (room.roomId -> room)
    room.roomId
  }

  def joinRoom(request: JoinRoomRequest)
    : Try[Flow[WebSocketMessage, WebSocketMessage, NotUsed]] = {
    this.rooms.get(request.roomId) match {
      case Some(value) =>
        value
          .join(request.accountId, request.isSpectator) match {
          case Failure(_) => value.getConnection(request.accountId)
          case Success(_) => value.getConnection(request.accountId)
        }
      case scala.None => Failure(new Exception("ルームが見つかりません"))
    }
  }

  def leaveRoom(request: LeaveRoomRequest): Try[Unit] = {
    this.rooms.get(request.roomId) match {
      case Some(value) =>
        value.leave(request.accountId)
      case scala.None => Failure(new Exception("ルームが見つかりません"))
    }
  }

  def removeRoom(request: RemoveRoomRequest): Unit = {
    this.rooms
      .get(request.roomId)
      .filter(_.closable(request.accountId))
      .foreach(_ => {
        this.rooms.remove(request.roomId)
      })
  }
}

object QuizRoomAggregates {
  val name = "RoomAggregate"

  object Protocol {
    case object GetRoomsRequest
    case class GetRoomsSuccess(rooms: Seq[QuizRoom])

    case class CreateRoomRequest(accountId: String, roomName: String)
    sealed trait CreateRoomResponse
    case class CreateRoomSuccess(roomId: String) extends CreateRoomResponse
    case class CreateRoomFailure(message: String) extends CreateRoomResponse

    case class JoinRoomRequest(roomId: String,
                               accountId: String,
                               isSpectator: Boolean)
    sealed trait JoinRoomResponse
    case class JoinRoomSuccess(
        connection: Flow[WebSocketMessage, WebSocketMessage, NotUsed])
        extends JoinRoomResponse
    case class JoinRoomFailure(message: String) extends JoinRoomResponse

    case class LeaveRoomRequest(roomId: String, accountId: String)

    case class RemoveRoomRequest(roomId: String, accountId: String)

  }

}
