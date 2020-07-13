package com.github.BambooTuna.RealtimeQuiz.domain.ws

sealed trait Destination {
  def accessible(id: String): Boolean
}

case object All extends Destination {
  override def accessible(id: String): Boolean = true
}
case class Users(ids: Seq[String]) extends Destination {
  override def accessible(id: String): Boolean = this.ids.contains(id)
}
case class User(id: String) extends Destination {
  override def accessible(id: String): Boolean = this.id == id
}
case object Internal extends Destination {
  override def accessible(id: String): Boolean = false
}
