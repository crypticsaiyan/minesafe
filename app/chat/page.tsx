"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { AudioRecorderButton } from "@/components/ai-elements/audio-recorder-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hellowbot() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;
    sendMessage({ text: message.text });
    setInput("");
  };

  const handleAudioTranscription = (text: string) => {
    setInput(text);
  };

  const isLoading = status === "submitted" || status === "streaming";

  // Suggested queries for Digital Mine Safety Officer
  const suggestedQueries = [
    "Show me all methane-related accidents in 2021 in underground coal mines",
    "What are the top causes of fatal accidents in Jharkhand?",
    "Recommend safety measures for ground movement prevention",
    "Find accidents caused by inadequate rock bolting",
    "Show transportation machinery accidents in Q3 2022",
    "What regulations were most frequently violated?",
  ];

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <div className="w-full max-w-6xl p-6 h-[calc(100vh-4rem)] rounded-lg">
      <div className="flex flex-col h-full gap-3">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Digital Mine Safety Officer</h2>
          <p className="text-sm text-blue-100">
            Ask domain-specific safety questions • Get regulatory compliance advice • Analyze accident patterns
          </p>
        </div>

        {/* Suggested Queries */}
        {messages.length === 0 && (
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm font-semibold mb-3 text-gray-700">
              Try these queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuery(query)}
                  className="text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Conversation className="flex-1 overflow-hidden border rounded-lg bg-white/70 backdrop-blur">
          <ConversationContent className="p-4 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type !== "text") return null;

                  const isUser = message.role === "user";

                  return (
                    <Fragment key={`${message.id}-${i}`}>
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap ${
                          isUser
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white border rounded-bl-none"
                        }`}
                      >
                        {!isUser && (
                          <Badge className="mb-2 bg-blue-600">
                            Safety Officer AI
                          </Badge>
                        )}
                        <Response>{part.text}</Response>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            ))}

            {isLoading && <Loader />}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="border rounded-lg bg-white shadow-sm"
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={
                isLoading
                  ? "Thinking..."
                  : "Ask about safety regulations, accident patterns, or compliance..."
              }
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools>
              <AudioRecorderButton
                onTranscriptionComplete={handleAudioTranscription}
                disabled={isLoading}
              />
            </PromptInputTools>

            <PromptInputSubmit disabled={isLoading} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
