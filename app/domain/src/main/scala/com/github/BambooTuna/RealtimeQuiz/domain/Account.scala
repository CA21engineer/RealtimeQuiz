package com.github.BambooTuna.RealtimeQuiz.domain

import com.github.BambooTuna.RealtimeQuiz.domain.AccountRole.Spectator
import com.github.BambooTuna.RealtimeQuiz.domain.ConnectionStatus.{
  Offline,
  Online
}

case class Account(
    id: String,
    name: String,
    role: AccountRole,
    stars: Int,
    answer: Option[String],
    isAnswered: Boolean,
    alterStars: Int,
    connectionStatus: ConnectionStatus = Offline
) {

//  var connectionOpened: Boolean = false

  def init(): Account = copy(answer = None, alterStars = 0)

  def rename(newName: String): Account = copy(name = newName)
  def setAnswer(newAnswer: String): Account = copy(answer = Some(newAnswer))
  def checkAnswer(f: String => Int): Account =
    copy(stars = this.stars + this.answer.map(f).getOrElse(0))

  def hideAnswer: Account = copy(answer = None)

  def activate: Account = copy(connectionStatus = Online)
  def leave: Account = copy(connectionStatus = Offline)

  override def equals(obj: Any): Boolean = obj match {
    case account: Account => this.id == account.id
    case _                => false
  }

}

object Account {
  def apply(id: String, role: AccountRole): Account = {
    Account(id, "名無しさん", role, 0, None, isAnswered = false, 0)
  }

  def apply(id: String): Account = {
    Account(id, "名無しさん", Spectator, 0, None, isAnswered = false, 0)
  }
}
