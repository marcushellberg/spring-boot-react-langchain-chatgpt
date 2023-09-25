package com.example.application.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.BrowserCallable;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.model.Tokenizer;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.model.openai.OpenAiTokenizer;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@BrowserCallable
@AnonymousAllowed
public class ChatService {

    @Value("${openai.api.key}")
    private String OPENAI_API_KEY;
    private Assistant assistant;

    interface Assistant {
        TokenStream chat(String message);
    }

    @PostConstruct
    public void init() {
        var memory = TokenWindowChatMemory.withMaxTokens(2000, new OpenAiTokenizer("gpt-3.5-turbo"));
        assistant = AiServices.builder(Assistant.class)
                .streamingChatLanguageModel(OpenAiStreamingChatModel.withApiKey(OPENAI_API_KEY))
                .chatMemory(memory)
                .build();
    }

    public Flux<String> chat(String message) {
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();

        assistant.chat(message)
                .onNext(sink::tryEmitNext)
                .onComplete(sink::tryEmitComplete)
                .onError(sink::tryEmitError)
                .start();

        return sink.asFlux();
    }
}
