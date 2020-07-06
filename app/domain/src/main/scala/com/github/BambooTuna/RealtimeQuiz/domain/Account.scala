package com.github.BambooTuna.RealtimeQuiz.domain

case class Account(accountId: String, name: String) {
  require(accountId.nonEmpty && name.nonEmpty)

  def rename(newName: String): Account = copy(name = newName)

  override def equals(obj: Any): Boolean = obj match {
    case Account(accountId, _) => this.accountId == accountId
    case _                     => false
  }
}
