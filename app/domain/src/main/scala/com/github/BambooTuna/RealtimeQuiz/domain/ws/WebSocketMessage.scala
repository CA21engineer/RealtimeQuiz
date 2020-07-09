package com.github.BambooTuna.RealtimeQuiz.domain.ws

import com.github.BambooTuna.RealtimeQuiz.domain.Account
import shapeless._
import io.circe._
import io.circe.syntax._
import io.circe.generic.auto._
import io.circe.shapes._

object WebSocketMessage {
  type Messages = Quiz :+: Answer :+: CorrectAnswer :+: CNil
  def parse(message: String): WebSocketMessage = {
    parser.decode[Messages](message) match {
      case Right(v) => Coproduct.unsafeGet(v).asInstanceOf[WebSocketMessage]
      case Left(e)  => ParseError(e.getMessage, message)
    }
  }
}

sealed trait WebSocketMessage {
  def toJsonString: String = this.asJson.noSpaces
  def addSender(account: Account): WebSocketMessageWithSender =
    WebSocketMessageWithSender(this, account)
}
case class ParseError(message: String, org: String) extends WebSocketMessage
case class ConnectionOpened(accountId: String, name: String)
    extends WebSocketMessage
case class ConnectionClosed(accountId: String, name: String)
    extends WebSocketMessage

case class Quiz(no: Int, content: String, points: Int) extends WebSocketMessage
case class Answer(content: String) extends WebSocketMessage
case class CorrectAnswer(content: String, points: Int) extends WebSocketMessage

case class WebSocketMessageWithSender(message: WebSocketMessage,
                                      from: Account) {
  def toJsonString: String =
    message.asJsonObject
      .+:("from", Json.fromString(from.accountId))
      .asJson
      .noSpaces
}
