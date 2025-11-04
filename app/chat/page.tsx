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

  return (
    <div className="w-full max-w-4xl p-6 h-[calc(100vh-4rem)] rounded-lg">
      <div className="flex flex-col h-full gap-3">
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
                        className={`max-w-[75%] px-4 py-2 rounded-xl shadow-sm whitespace-pre-wrap ${
                          isUser
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white border rounded-bl-none"
                        }`}
                      >
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
              placeholder={isLoading ? "Thinking..." : "Type your message..."}
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
