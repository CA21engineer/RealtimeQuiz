package com.github.BambooTuna.RealtimeQuiz.domain.lib

import akka.NotUsed
import akka.actor.ActorRef
import akka.stream.scaladsl.{BroadcastHub, Flow, Keep, Sink, Source}
import akka.stream.{Materializer, OverflowStrategy, SharedKillSwitch}
import org.slf4j.{Logger, LoggerFactory}

object StreamSupport {

  def actorSource[O](setIgnoreSink: Boolean = false)(
      implicit materializer: Materializer): (ActorRef, Source[O, NotUsed]) = {
    val actorRefSource: Source[O, ActorRef] =
      Source.actorRef[O](bufferSize = 1024, OverflowStrategy.dropBuffer)
    val (a, s) = actorRefSource
      .toMat(BroadcastHub.sink[O](bufferSize = 1024))(Keep.both)
      .run()
    if (setIgnoreSink) s to Sink.ignore run ()
    (a, s)
  }

  def actorSourceWithKillSwitch[O](killSwitch: SharedKillSwitch,
                                   setIgnoreSink: Boolean = false)(
      implicit materializer: Materializer): (ActorRef, Source[O, NotUsed]) = {
    val actorRefSource: Source[O, ActorRef] =
      Source.actorRef[O](bufferSize = 1024, OverflowStrategy.dropBuffer)
    val (a, s) = actorRefSource
      .toMat(BroadcastHub.sink[O](bufferSize = 1024))(Keep.both)
      .run()
    if (setIgnoreSink) s to Sink.ignore run ()
    (a, s via killSwitch.flow)
  }

  def loggerFlow[I](
      logger: Logger = LoggerFactory.getLogger(getClass)): Flow[I, I, NotUsed] =
    Flow[I].map { data =>
      logger.info(data.toString)
      data
    }

}
