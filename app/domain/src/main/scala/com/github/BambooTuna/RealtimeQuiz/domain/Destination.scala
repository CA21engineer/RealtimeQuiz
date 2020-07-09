package com.github.BambooTuna.RealtimeQuiz.domain

sealed trait Destination
case object All extends Destination
case object Parent extends Destination
case object Children extends Destination
case class Users(accountIds: Seq[String]) extends Destination
case class User(accountId: String) extends Destination
case object None extends Destination
