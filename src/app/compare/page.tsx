"use client";

import { useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PROVIDER_CATALOG } from "@/lib/ai/providers";
import { Button } from "@/components/ui/button";

type ModelSelection = {
  providerId: string;
  modelId: string;
  label: string;
};

const DEFAULT_MODELS: ModelSelection[] = [
  {
    providerId: "anthropic",
    modelId: "claude-sonnet-4-20250514",
    label: "Claude Sonnet 4",
  },
  { providerId: "openai", modelId: "gpt-4o", label: "GPT-4o" },
];

function CompareColumn({
  model,
  isRunning,
}: {
  model: ModelSelection;
  isRunning: boolean;
}) {
  const provider = PROVIDER_CATALOG[model.providerId];

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          providerId: model.providerId,
          modelId: model.modelId,
          conversationId: "",
        },
      }),
    [model.providerId, model.modelId]
  );

  const { messages, status } = useChat({
    id: `compare-${model.providerId}-${model.modelId}`,
    transport,
  });

  const loading = status === "submitted" || status === "streaming";
  const assistantMsg = messages.find((m) => m.role === "assistant");

  const textContent =
    assistantMsg?.parts
      ?.filter(
        (p): p is { type: "text"; text: string } => p.type === "text"
      )
      .map((p) => p.text)
      .join("") ?? "";

  return (
    <div className="flex-1 flex flex-col border-r border-border-subtle last:border-r-0 min-w-0">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle bg-surface/50">
        {provider && (
          <Image
            src={provider.iconPath}
            alt=""
            width={16}
            height={16}
            className="opacity-60"
          />
        )}
        <span className="text-sm font-medium text-zinc-300">
          {model.label}
        </span>
        {loading && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {textContent ? (
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {textContent}
            {loading && (
              <span className="inline-block w-1.5 h-4 bg-accent/70 ml-0.5 animate-pulse rounded-sm" />
            )}
          </p>
        ) : isRunning ? (
          <div className="space-y-3">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-4 w-3/5 rounded" />
          </div>
        ) : (
          <p className="text-sm text-zinc-600">Waiting for prompt...</p>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [models] = useState<ModelSelection[]>(DEFAULT_MODELS);

  const handleCompare = () => {
    if (!prompt.trim()) return;
    setIsRunning(true);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
        <div>
          <h1 className="text-base font-semibold text-zinc-100 tracking-tight">
            Compare Models
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Send the same prompt to multiple models side by side
          </p>
        </div>
        <a
          href="/chat"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Back to chat
        </a>
      </div>

      <div className="border-b border-border-subtle px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to compare across models..."
            rows={2}
            className={cn(
              "flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3",
              "text-sm text-zinc-100 placeholder:text-zinc-500",
              "focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-accent/30",
              "transition-colors"
            )}
          />
          <Button
            onClick={handleCompare}
            disabled={!prompt.trim() || isRunning}
            className="self-end"
          >
            Compare
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {models.map((model) => (
          <CompareColumn
            key={`${model.providerId}-${model.modelId}`}
            model={model}
            isRunning={isRunning}
          />
        ))}
      </div>
    </div>
  );
}
