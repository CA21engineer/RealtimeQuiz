package com.github.BambooTuna.RealtimeQuiz.domain

import akka.NotUsed
import akka.actor.ActorRef
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.github.BambooTuna.RealtimeQuiz.domain.lib.StreamSupport
import com.github.BambooTuna.RealtimeQuiz.domain.ws.{Answer, WebSocketMessage}

case class Account(accountId: String,
                   name: String,
                   answer: Answer,
                   points: Int) {
  require(accountId.nonEmpty && name.nonEmpty)

  def rename(newName: String): Account = copy(name = newName)
  def updateAnswer(newAnswer: Answer): Account = copy(answer = newAnswer)
  def checkTheAnswer(f: Answer => Int): Account =
    copy(points = this.points + f(this.answer))

  override def equals(obj: Any): Boolean = obj match {
    case Account(accountId, _, _, _) => this.accountId == accountId
    case _                           => false
  }
}

object Account {
  def empty(accountId: String): Account = {
    Account(accountId, "_", Answer(""), 0)
  }
  def create(accountId: String, name: String): Account = {
    Account(accountId, name, Answer(""), 0)
  }
}
