package com.github.BambooTuna.RealtimeQuiz.domain.ws

case class WebSocketMessageWithDestination(data: WebSocketMessage,
                                           destination: Destination)
