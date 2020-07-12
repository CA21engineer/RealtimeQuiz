package com.github.BambooTuna.RealtimeQuiz.domain.ws

import com.github.BambooTuna.RealtimeQuiz.domain.{
  Account,
  AlterStar,
  CurrentStatus
}
import shapeless._
import io.circe._
import io.circe.syntax._
import io.circe.generic.auto._
import io.circe.shapes._

object WebSocketMessage {
  type Messages =
    JoiningRoom :+: SetQuestion :+: SetAnswer :+: SetAlterStars :+: GoToNextQuestion :+: CNil

  def parse(message: String): WebSocketMessage = {
    val json = parser.parse(message).getOrElse(Json.Null)
    json.hcursor.downField("type").as[String] match {
      case Left(value) => ParseError(value.getMessage(), message)
      case Right(value) =>
        json.hcursor.downField("data").as[Messages] match {
          case Right(v) =>
            val WebSocketMessage =
              Coproduct.unsafeGet(v).asInstanceOf[WebSocketMessage]
            if (WebSocketMessage.typeName == value) WebSocketMessage
            else ParseError("typeName failed", message)
          case Left(e) => ParseError(e.getMessage(), message)
        }
    }
  }

  def connectionClosed(id: String): WebSocketMessageWithDestination =
    WebSocketMessageWithDestination(ConnectionClosed(id), Internal)

}

sealed trait WebSocketMessage {
  val typeName: String = getClass.getSimpleName

  override def toString: String = this match {
    case data: ParseError =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: ConnectionClosed =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: PlayerList =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: JoiningRoom =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: SetQuestion =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: SetAnswer =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: SetAlterStars =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: GoToNextQuestion =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
  }
}

case class ParseError(message: String, org: String) extends WebSocketMessage
case class ConnectionClosed(id: String) extends WebSocketMessage
// Receive Only
case class PlayerList(
    currentStatus: CurrentStatus,
    currentQuestion: Option[String],
    currentTimeLimit: Option[Int],
    players: Seq[Account]
) extends WebSocketMessage

// Send Only
case class JoiningRoom(accountName: String) extends WebSocketMessage
case class SetQuestion(question: String) extends WebSocketMessage
case class SetAnswer(answer: String) extends WebSocketMessage
case class SetAlterStars(alterStars: Seq[AlterStar]) extends WebSocketMessage
case class GoToNextQuestion() extends WebSocketMessage
