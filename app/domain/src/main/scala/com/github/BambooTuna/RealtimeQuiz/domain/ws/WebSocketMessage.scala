package com.github.BambooTuna.RealtimeQuiz.domain.ws

import com.github.BambooTuna.RealtimeQuiz.domain.{Account, Destination}
import shapeless._
import io.circe._
import io.circe.syntax._
import io.circe.generic.auto._
import io.circe.shapes._

object WebSocketMessage {
  type Messages = Quiz :+: Answer :+: CorrectAnswer :+: ReName :+: CNil
  def parse(message: String): WebSocketMessage = {
    parser.decode[Messages](message) match {
      case Right(v) => Coproduct.unsafeGet(v).asInstanceOf[WebSocketMessage]
      case Left(e)  => ParseError(e.getMessage, message)
    }
  }
}

sealed trait WebSocketMessage {
  def toJsonString: String = this.asJson.noSpaces
  def addDestination(
      destination: Destination): WebSocketMessageWithDestination =
    WebSocketMessageWithDestination(this, destination)
}

// Receive
case class ParseError(message: String, org: String) extends WebSocketMessage
case class ConnectionOpened(accountId: String, name: String)
    extends WebSocketMessage
case class ConnectionClosed(accountId: String, name: String)
    extends WebSocketMessage
case class TemporaryData(answer: String, points: Int) extends WebSocketMessage

// Send & Receive
case class Quiz(no: Int, content: String, points: Int) extends WebSocketMessage
case class Answer(content: String) extends WebSocketMessage
case class CorrectAnswer(content: String, points: Int) extends WebSocketMessage

// Send
case class ReName(name: String) extends WebSocketMessage

case class WebSocketMessageWithDestination(message: WebSocketMessage,
                                           destination: Destination) {
  def toJsonString: String =
    message.asJson.noSpaces
}
