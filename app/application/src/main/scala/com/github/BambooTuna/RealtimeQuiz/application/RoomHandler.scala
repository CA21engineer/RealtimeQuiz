package com.github.BambooTuna.RealtimeQuiz.application

import akka.NotUsed
import akka.actor.ActorRef
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.pattern.ask
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directive
import akka.http.scaladsl.server.Directives._
import akka.stream.Materializer
import akka.stream.scaladsl.Flow
import akka.util.Timeout
import com.github.BambooTuna.RealtimeQuiz.application.json.{
  CreateRoomJson,
  RoomJson
}
import com.github.BambooTuna.RealtimeQuiz.domain.QuizRoomAggregates.Protocol._
import com.github.BambooTuna.RealtimeQuiz.domain.ws.WebSocketMessage

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.{Failure, Success}
import io.circe.generic.auto._
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._
import org.slf4j.{Logger, LoggerFactory}

class RoomHandler(roomAggregate: ActorRef)(
    implicit materializer: Materializer) {
  type QueryP[Q] = Directive[Q] => Route

  val logger: Logger = LoggerFactory.getLogger(getClass)

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
              RoomJson(room.roomId, room.roomName, room.participants)
            })
    }

  }

  def createRoomRoute: QueryP[Tuple1[String]] = _ { accountId =>
    entity(as[CreateRoomJson]) { json =>
      val f =
        (roomAggregate ? CreateRoomRequest(accountId, json.roomName))
          .asInstanceOf[Future[CreateRoomResponse]]
      onComplete(f) {
        case Failure(exception) =>
          complete(StatusCodes.InternalServerError, exception.getMessage)
        case Success(value) =>
          value match {
            case CreateRoomSuccess(roomId) =>
              complete(StatusCodes.OK -> RoomJson(roomId, json.roomName, 0))
            case CreateRoomFailure(message) =>
              complete(StatusCodes.BadRequest, message)
          }
      }
    }
  }

  def joinRoomRoute: QueryP[(String, String)] = _ { (roomId, accountId) =>
    parameters('isSpectator.as[Boolean] ?) { isSpectator =>
      val f =
        (roomAggregate ? JoinRoomRequest(roomId,
                                         accountId,
                                         isSpectator.getOrElse(false)))
          .asInstanceOf[Future[JoinRoomResponse]]
      onComplete(f) {
        case Failure(exception) =>
          complete(StatusCodes.InternalServerError, exception.getMessage)
        case Success(value) =>
          value match {
            case JoinRoomSuccess(connection) =>
              //TODO when parent disconnected, remove room from aggregate
              handleWebSocketMessages(decodeFlow via connection via encodeFlow)
            case JoinRoomFailure(message) =>
              println(message)
              complete(StatusCodes.BadRequest, message)
          }
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
