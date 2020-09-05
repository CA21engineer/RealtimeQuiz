package com.github.BambooTuna.RealtimeQuiz.domain

case class Question(problemStatement: String,
                    correctAnswer: Option[String],
                    timeLimit: Option[Int]) {

  def hideCorrectAnswer: Question = copy(correctAnswer = None)

}
