package com.github.BambooTuna.RealtimeQuiz.domain

import enumeratum.values._

sealed abstract class CurrentStatus(val value: String) extends StringEnumEntry
case object CurrentStatus
    extends StringEnum[CurrentStatus]
    with StringCirceEnum[CurrentStatus] {

  case object WaitingQuestion extends CurrentStatus("WAITING_QUESTION")
  case object CloseAnswer extends CurrentStatus("CLOSE_ANSWER")
  case object OpenAnswer extends CurrentStatus("OPEN_ANSWER")
  case object OpenAggregate extends CurrentStatus("OPEN_AGGREGATE")

  val values = findValues
}
