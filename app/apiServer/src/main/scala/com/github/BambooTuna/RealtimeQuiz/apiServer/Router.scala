package com.github.BambooTuna.RealtimeQuiz.apiServer

import akka.http.scaladsl.model.HttpMethod
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{Directive, PathMatcher, Route}

object Router {

  def apply(routes: Route*): Router = new Router(routes)

}

class Router(val routes: Seq[Route]) {

  def create: Route =
    routes.reduce(_ ~ _)

  def +(router: Router): Router =
    new Router(this.routes ++ router.routes)

}

object route {

  def apply[Q](m: HttpMethod,
               p: PathMatcher[Q],
               route: Directive[Q] => Route): Route =
    method(m) {
      route(path(p))
    }

}
