package com.github.BambooTuna.RealtimeQuiz.domain

import enumeratum.values._

sealed abstract class ConnectionStatus(val value: String)
    extends StringEnumEntry
case object ConnectionStatus
    extends StringEnum[ConnectionStatus]
    with StringCirceEnum[ConnectionStatus] {

  case object Online extends ConnectionStatus("online")
  case object Offline extends ConnectionStatus("offline")

  val values = findValues
}
