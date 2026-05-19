"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import type { UIMessage } from "ai";

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  selectedProvider: string;
  selectedModel: string;
}

export function MessageList({
  messages,
  isLoading,
  selectedProvider,
  selectedModel,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="h-12 w-12 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center mx-auto mb-5">
            <svg
              className="h-6 w-6 text-accent/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-200 tracking-tight mb-2">
            Start a conversation
          </h2>
          <p className="text-sm text-muted leading-relaxed max-w-[45ch] mx-auto">
            Pick a model from the selector below and send your first message. Switch providers anytime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-6">
        {messages.map((msg, i) => {
          // Extract text content from UIMessage parts
          const textContent = msg.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("") ?? "";

          return (
            <MessageBubble
              key={msg.id || i}
              role={msg.role as "user" | "assistant"}
              content={textContent}
              providerId={
                msg.role === "assistant" ? selectedProvider : undefined
              }
              modelId={msg.role === "assistant" ? selectedModel : undefined}
              isStreaming={
                isLoading &&
                i === messages.length - 1 &&
                msg.role === "assistant"
              }
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
