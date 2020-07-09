package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.actor.ActorRef
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.{KillSwitches, Materializer, SharedKillSwitch}
import akka.stream.scaladsl.{Flow, Sink, Source}
import com.github.BambooTuna.RealtimeQuiz.domain.lib.StreamSupport
import com.github.BambooTuna.RealtimeQuiz.domain.ws.{
  WebSocketMessage,
  WebSocketMessageWithDestination
}

case class RoomConnection(
    actorRef: ActorRef,
    source: Source[WebSocketMessageWithDestination, NotUsed])

object RoomConnection {
  def create(roomId: String)(
      implicit materializer: Materializer): RoomConnection = {
    val (actorRef, source) =
      StreamSupport.actorSource[WebSocketMessageWithDestination](
        setIgnoreSink = false)
    RoomConnection(actorRef, source)
  }

}
