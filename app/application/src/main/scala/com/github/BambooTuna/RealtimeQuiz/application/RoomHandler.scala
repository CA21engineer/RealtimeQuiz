package com.github.BambooTuna.RealtimeQuiz.application

import akka.NotUsed
import akka.actor.ActorRef
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.ws.{BinaryMessage, Message, TextMessage}
import akka.pattern.ask
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directive
import akka.http.scaladsl.server.Directives._
import akka.stream.Materializer
import akka.stream.scaladsl.{Flow, Sink}
import akka.util.Timeout
import com.github.BambooTuna.RealtimeQuiz.application.json.RoomJson
import com.github.BambooTuna.RealtimeQuiz.domain.Account
import com.github.BambooTuna.RealtimeQuiz.domain.RoomAggregate.Protocol._
import com.github.BambooTuna.RealtimeQuiz.domain.ws.WebSocketMessage

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.{Failure, Success}
import io.circe.generic.auto._
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._

class RoomHandler(roomAggregate: ActorRef)(
    implicit materializer: Materializer) {
  type QueryP[Q] = Directive[Q] => Route

  implicit val timeout = Timeout(5.seconds)

  def getRoomsRoute: QueryP[Unit] = _ {
    val f =
      (roomAggregate ? GetRoomsRequest).asInstanceOf[Future[GetRoomsSuccess]]
    onComplete(f) {
      case Failure(exception) =>
        complete(StatusCodes.InternalServerError, exception.getMessage)
      case Success(value) =>
        complete(
          StatusCodes.OK ->
            value.rooms.map { room =>
              RoomJson(room.roomId, room.children.size)
            })
    }

  }

  def createRoomRoute: QueryP[(String, String)] = _ { (accountId, name) =>
    val f =
      (roomAggregate ? CreateRoomRequest(Account.create(accountId, name)))
        .asInstanceOf[Future[CreateRoomResponse]]
    onComplete(f) {
      case Failure(exception) =>
        complete(StatusCodes.InternalServerError, exception.getMessage)
      case Success(value) =>
        value match {
          case CreateRoomSuccess(roomId) =>
            complete(StatusCodes.OK -> RoomJson(roomId, 0))
          case CreateRoomFailure(message) =>
            complete(StatusCodes.BadRequest, message)
        }
    }
  }

  def joinRoomRoute: QueryP[(String, String, String)] = _ {
    (roomId, accountId, name) =>
      val f =
        (roomAggregate ? JoinRoomRequest(roomId, accountId, name))
          .asInstanceOf[Future[JoinRoomResponse]]
      onComplete(f) {
        case Failure(exception) =>
          complete(StatusCodes.InternalServerError, exception.getMessage)
        case Success(value) =>
          value match {
            case JoinRoomSuccess(connection) =>
              handleWebSocketMessages(
                decodeFlow via connection.watchTermination()((_, f) => {
                  f.onComplete { _ =>
                    roomAggregate ! RemoveRoomRequest(accountId, roomId)
                  }(materializer.executionContext)
                }) via encodeFlow)
            case JoinRoomFailure(message) =>
              println(message)
              complete(StatusCodes.BadRequest, message)
          }
      }
  }

  def decodeFlow: Flow[Message, WebSocketMessage, NotUsed] = {
    Flow[Message].map {
      case TextMessage.Strict(message) =>
        WebSocketMessage.parse(message)
    }
  }

  def encodeFlow: Flow[WebSocketMessage, Message, NotUsed] = {
    Flow[WebSocketMessage].map(a => TextMessage.Strict(a.toJsonString))
  }

}
