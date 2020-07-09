package com.github.BambooTuna.RealtimeQuiz.domain

import com.github.BambooTuna.RealtimeQuiz.domain.ws._

trait QuizSupport {
  var parent: Account
  var children: Set[Account] = Set.empty
  var quiz: Option[Quiz] = scala.None

  def isParent(accountId: String): Boolean =
    this.parent == Account.empty(accountId)
  def isChild(accountId: String): Boolean =
    this.children.contains(Account.empty(accountId))

  def setQuiz(accountId: String, quiz: Quiz): Unit = {
    if (isParent(accountId)) this.quiz = Some(quiz)
  }

  def writeAnswer(accountId: String, answer: Answer): Unit = {
    if (isChild(accountId)) {
      val account = this.children.find(_.accountId == accountId)
      account.foreach(a =>
        this.children = this.children - a + a.updateAnswer(answer))
    }
  }

  def setAccountName(accountId: String, name: String): Unit = {
    if (this.parent.accountId == accountId)
      this.parent = this.parent.rename(name)
    else
      this.children
        .find(_.accountId == accountId)
        .foreach(a => this.children = this.children - a + a.rename(name))
  }

}
