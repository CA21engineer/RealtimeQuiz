package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.actor.ActorRef
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.{KillSwitches, Materializer, SharedKillSwitch}
import akka.stream.scaladsl.{Sink, Source}
import com.github.BambooTuna.RealtimeQuiz.domain.lib.StreamSupport

case class RoomConnection(private val actorRef: ActorRef,
                          sink: Sink[Message, NotUsed],
                          source: Source[Message, NotUsed]) {


}

object RoomConnection {
  def create(roomId: String)(
      implicit materializer: Materializer): RoomConnection = {
    val killSwitch: SharedKillSwitch = KillSwitches.shared(roomId)
    val (actorRef, source) =
      StreamSupport.actorSource[Message](setIgnoreSink = false)
    RoomConnection(
      actorRef,
      Sink.actorRef(actorRef, TextMessage.Strict("ConnectionClosed")),
      source via killSwitch.flow)
  }

}
