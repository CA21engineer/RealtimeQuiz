package com.github.BambooTuna.RealtimeQuiz.domain

case class Question(problemStatement: String, correctAnswer: Option[String]) {

  def hideCorrectAnswer: Question = copy(correctAnswer = None)

}
