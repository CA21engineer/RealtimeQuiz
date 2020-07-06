package com.github.BambooTuna.RealtimeQuiz.apiServer

import akka.http.scaladsl.model.HttpMethods.GET
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{
  Directive,
  ExceptionHandler,
  RejectionHandler,
  Route
}
import akka.stream.Materializer
import org.slf4j.{Logger, LoggerFactory}
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings

import scala.util.control.NonFatal

class ServiceHandler(implicit materializer: Materializer) {
  val logger: Logger = LoggerFactory.getLogger(getClass)

  def exceptionHandler(logger: Logger): ExceptionHandler = ExceptionHandler {
    case NonFatal(t) =>
      logger.error(t.getMessage, t)
      complete(StatusCodes.InternalServerError, t.getMessage)
  }

  def rejectionHandler =
    RejectionHandler
      .newBuilder()
      .handleNotFound { complete(StatusCodes.NotFound) }
      .result()

  def toRoutes: Route = cors(CorsSettings.defaultSettings) {
    handleExceptions(exceptionHandler(logger)) {
      handleRejections(rejectionHandler) {
        pathPrefix("api") {
          commonRoute.create
        }
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

}
