package com.example.application.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.BrowserCallable;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.model.openai.OpenAiTokenizer;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@BrowserCallable
@AnonymousAllowed
public class ChatService {
    @Value("${openai.api.key}")
    private String OPENAI_API_KEY;
    private Assistant assistant;
    private StreamingAssistant streamingAssistant;

    interface Assistant {
        String chat(String message);
    }

    interface StreamingAssistant {
        TokenStream chat(String message);
    }

    @PostConstruct
    public void init() {

        if (OPENAI_API_KEY == null) {
            System.err.println("ERROR: OPENAI_API_KEY environment variable is not set. Please set it to your OpenAI API key.");
        }

        var memory = TokenWindowChatMemory.withMaxTokens(2000, new OpenAiTokenizer("gpt-3.5-turbo"));

        assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(OpenAiChatModel.withApiKey(OPENAI_API_KEY))
                .chatMemory(memory)
                .build();

        streamingAssistant = AiServices.builder(StreamingAssistant.class)
                .streamingChatLanguageModel(OpenAiStreamingChatModel.withApiKey(OPENAI_API_KEY))
                .chatMemory(memory)
                .build();
    }

    public String chat(String message) {
        return assistant.chat(message);
    }

    public Flux<String> chatStream(String message) {
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();

        streamingAssistant.chat(message)
                .onNext(sink::tryEmitNext)
                .onComplete(c -> sink.tryEmitComplete())
                .onError(sink::tryEmitError)
                .start();

        return sink.asFlux();
    }
}
