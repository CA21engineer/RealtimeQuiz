package com.github.BambooTuna.RealtimeQuiz.domain

import enumeratum.values._

sealed abstract class AccountRole(val value: String) extends StringEnumEntry
case object AccountRole
    extends StringEnum[AccountRole]
    with StringCirceEnum[AccountRole] {

  case object Admin extends AccountRole("admin")
  case object Player extends AccountRole("player")
  case object Spectator extends AccountRole("spectator")

  val values = findValues
}
