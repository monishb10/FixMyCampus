package com.fixmycampus.controller;

import com.fixmycampus.dto.ChatRequest;
import com.fixmycampus.dto.ChatResponse;
import com.fixmycampus.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return new ChatResponse(chatService.reply(request.message()));
    }
}
