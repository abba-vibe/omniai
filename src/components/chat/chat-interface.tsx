"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useCallback, useMemo } from "react";
import { MessageList } from "./message-list";
import { MessageComposer } from "./message-composer";
import type { ProviderId, ProviderConfigClient } from "@/types/provider";

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages?: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  configuredProviders: ProviderConfigClient[];
  defaultProvider?: ProviderId;
  defaultModel?: string;
}

export function ChatInterface({
  conversationId,
  configuredProviders,
  defaultProvider = "anthropic",
  defaultModel = "claude-sonnet-4-20250514",
}: ChatInterfaceProps) {
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderId>(defaultProvider);
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          providerId: selectedProvider,
          modelId: selectedModel,
          conversationId,
        },
      }),
    [selectedProvider, selectedModel, conversationId]
  );

  const { messages, status, sendMessage, stop } = useChat({
    id: `chat-${conversationId}`,
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = useCallback(
    (content: string) => {
      sendMessage({ text: content });
    },
    [sendMessage]
  );

  const handleProviderChange = useCallback(
    (providerId: ProviderId, modelId: string) => {
      setSelectedProvider(providerId);
      setSelectedModel(modelId);
    },
    []
  );

  return (
    <div className="flex flex-col h-full">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        selectedProvider={selectedProvider}
        selectedModel={selectedModel}
      />
      <MessageComposer
        onSend={handleSend}
        isLoading={isLoading}
        selectedProvider={selectedProvider}
        selectedModel={selectedModel}
        onProviderChange={handleProviderChange}
        configuredProviders={configuredProviders}
        onStop={stop}
      />
    </div>
  );
}
