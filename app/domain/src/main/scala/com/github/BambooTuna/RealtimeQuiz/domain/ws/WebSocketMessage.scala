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
    ChangeName :+: SetQuestion :+: SetAnswer :+: SetAlterStars :+: CNil

  def parse(message: String): WebSocketMessage = {
    val json = parser.parse(message).getOrElse(Json.Null)
    json.hcursor.downField("type").as[String] match {
      case Left(value) => ParseError(value.getMessage(), message)
      case Right(value) =>
        if (value == GoToNextQuestion.typeName) GoToNextQuestion
        else if (value == CloseApplications.typeName) CloseApplications
        else if (value == OpenAnswers.typeName) OpenAnswers
        else if (value == GoToResult.typeName) GoToResult
        else {
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
  }

  def connectionClosed(id: String): WebSocketMessageWithDestination =
    WebSocketMessageWithDestination(ConnectionClosed(id), Internal)

}

sealed trait WebSocketMessage {
  val typeName: String = getClass.getSimpleName

  def toJsonString: String = this match {
    case data: PlayerList =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case data: ForceSendAnswer =>
      Json
        .obj("type" -> Json.fromString(typeName), "data" -> data.asJson)
        .noSpaces
    case _ => """{"type":"ERROR"}"""
  }
}

case class ParseError(message: String, org: String) extends WebSocketMessage
case class ConnectionClosed(id: String) extends WebSocketMessage
// Receive Only
case class PlayerList(
    currentStatus: CurrentStatus,
    currentQuestion: Option[String],
    currentCorrectAnswer: Option[String],
    currentTime: Option[Int],
    players: Seq[Account]
) extends WebSocketMessage {

  def fetch(isParent: Boolean): PlayerList = {
    (if (isParent) {
       this
     } else {
       currentStatus match {
         case CurrentStatus.WaitingQuestion =>
           copy(currentCorrectAnswer = None,
                players = players.map(_.hideAnswer.hideAlterStars))
         case CurrentStatus.WaitingAnswer =>
           copy(currentCorrectAnswer = None,
                players = players.map(_.hideAnswer.hideAlterStars))
         case CurrentStatus.CloseAnswer =>
           copy(currentCorrectAnswer = None,
                players = players.map(_.hideAnswer.hideAlterStars))
         case CurrentStatus.OpenAnswer =>
           copy(currentCorrectAnswer = None,
                players = players.map(_.hideAlterStars))
         case CurrentStatus.OpenAggregate => this
       }
     }).copy(players = players.sortBy(_.id))
  }

}
case class ForceSendAnswer() extends WebSocketMessage

// Send Only
case class ChangeName(accountName: String) extends WebSocketMessage
// timeLimit: 秒
case class SetQuestion(question: String,
                       correctAnswer: Option[String],
                       timeLimit: Option[Int])
    extends WebSocketMessage
case class SetAnswer(answer: String) extends WebSocketMessage
case object CloseApplications extends WebSocketMessage {
  override val typeName: String = "CloseApplications"
}
case object OpenAnswers extends WebSocketMessage {
  override val typeName: String = "OpenAnswers"
}
case class SetAlterStars(alterStars: Seq[AlterStar]) extends WebSocketMessage
case object GoToResult extends WebSocketMessage {
  override val typeName: String = "GoToResult"
}
case object GoToNextQuestion extends WebSocketMessage {
  override val typeName: String = "GoToNextQuestion"
}
