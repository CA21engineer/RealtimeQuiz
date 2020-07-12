package com.github.BambooTuna.RealtimeQuiz.domain

import enumeratum.values._

sealed abstract class CurrentStatus(val value: String) extends StringEnumEntry {
  def next: CurrentStatus
}

case object CurrentStatus
    extends StringEnum[CurrentStatus]
    with StringCirceEnum[CurrentStatus] {

  case object WaitingQuestion extends CurrentStatus("WAITING_QUESTION") {
    override def next: CurrentStatus = CloseAnswer
  }
  case object CloseAnswer extends CurrentStatus("CLOSE_ANSWER") {
    override def next: CurrentStatus = OpenAnswer
  }
  case object OpenAnswer extends CurrentStatus("OPEN_ANSWER") {
    override def next: CurrentStatus = OpenAggregate
  }
  case object OpenAggregate extends CurrentStatus("OPEN_AGGREGATE") {
    override def next: CurrentStatus = WaitingQuestion
  }

  val values = findValues
}
