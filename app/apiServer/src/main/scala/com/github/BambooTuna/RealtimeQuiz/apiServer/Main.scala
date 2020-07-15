package com.github.BambooTuna.RealtimeQuiz.apiServer

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.StatusCodes
import akka.stream.ActorMaterializer
import com.typesafe.config.{Config, ConfigFactory}
import akka.http.scaladsl.server.Directives._
import com.evolutiongaming.metrics.{MetricCollectors, MetricResources, Report}
import io.prometheus.client.Counter
import org.slf4j.{Logger, LoggerFactory}

import scala.concurrent.ExecutionContextExecutor

object Main extends App {

  val rootConfig: Config = ConfigFactory.load()
  val logger: Logger = LoggerFactory.getLogger(getClass)

  implicit val system: ActorSystem = ActorSystem()
  implicit val materializer: ActorMaterializer = ActorMaterializer()
  implicit val executionContext: ExecutionContextExecutor = system.dispatcher

  implicit lazy val collectors: MetricCollectors = new MetricCollectors()

  val serverStartCounter: Counter =
    collectors.registerCounter(
      _.name("server_start").help("server start count"))
  serverStartCounter.inc()

  def metrics = Report(collectors)
  val metricsRoute = new MetricResources(metrics).route

  val serviceHandler = new ServiceHandler()

  val bindingFuture = Http().bindAndHandle(
    handler = serviceHandler.toRoutes ~ metricsRoute,
    interface = "0.0.0.0",
    port = 18080
  )

  sys.addShutdownHook {
    bindingFuture
      .flatMap(_.unbind())
      .onComplete(_ => system.terminate())
  }

}
