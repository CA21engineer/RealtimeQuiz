package com.github.BambooTuna.RealtimeQuiz.apiServer

import akka.actor.{ActorRef, ActorSystem, Props}
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{Directive, ExceptionHandler, RejectionHandler, Route}
import akka.stream.Materializer
import org.slf4j.{Logger, LoggerFactory}
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import com.evolutiongaming.metrics.MetricCollectors
import com.github.BambooTuna.RealtimeQuiz.application.RoomHandler
import com.github.BambooTuna.RealtimeQuiz.domain.QuizRoomAggregates

import scala.util.control.NonFatal

class ServiceHandler(implicit actorSystem: ActorSystem,
                     materializer: Materializer, collectors: MetricCollectors) {
  val logger: Logger = LoggerFactory.getLogger(getClass)

  def exceptionHandler(logger: Logger): ExceptionHandler = ExceptionHandler {
    case NonFatal(t) =>
      logger.error(t.getMessage, t)
      complete(StatusCodes.InternalServerError, t.getMessage)
  }

  def rejectionHandler =
    RejectionHandler
      .newBuilder()
      .handleNotFound { getFromFile("/dist/index.html") }
      .result()

  def toRoutes: Route = cors(CorsSettings.defaultSettings) {
    handleExceptions(exceptionHandler(logger)) {
      handleRejections(rejectionHandler) {
        restApiRoute ~
          realtimeApiRoute ~
          getFromDirectory("/dist")
      }
    }
  }

  def commonRoute(implicit materializer: Materializer): Router = {
    Router(
      route(GET, "health", { _: Directive[Unit] =>
        complete(StatusCodes.OK)
      }),
    )
  }

  val roomAggregate =
    actorSystem.actorOf(Props(classOf[QuizRoomAggregates], collectors), QuizRoomAggregates.name)
  val roomHandler = new RoomHandler(roomAggregate)

  def restApiRoute(implicit materializer: Materializer): Route = {
    pathPrefix("api") {
      Router(
        route(GET, "room", roomHandler.getRoomsRoute),
        route(POST,
              "room" / "accountId" / Segment,
              roomHandler.createRoomRoute),
      ).create
    }
  }

  def realtimeApiRoute(implicit materializer: Materializer): Route = {
    pathPrefix("ws") {
      Router(
        route(GET,
              "room" / Segment / "accountId" / Segment,
              roomHandler.joinRoomRoute),
      ).create
    }
  }

}
