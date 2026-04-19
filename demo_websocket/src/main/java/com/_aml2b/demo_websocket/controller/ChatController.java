package com._aml2b.demo_websocket.controller;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

import com._aml2b.demo_websocket.model.Message;

@Controller
public class ChatController {

    @MessageMapping("/chat")          // client sends here
    @SendTo("/topic/messages")        // broadcast to all
    public Message sendMessage(Message message) {
    	String messageType = message.getType() == null ? "TEXT" : message.getType();
    	if ("TEXT".equalsIgnoreCase(messageType)) {
    		System.out.println(message.getSender() + " : " + message.getContent());
    	} else {
    		System.out.println(message.getSender() + " sent a " + messageType + " message");
    	}
        return message;
    }
}