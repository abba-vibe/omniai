"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { PROVIDER_CATALOG } from "@/lib/ai/providers";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  providerId?: string | null;
  modelId?: string | null;
  isStreaming?: boolean;
}

export function MessageBubble({
  role,
  content,
  providerId,
  modelId,
  isStreaming,
}: MessageBubbleProps) {
  const provider = providerId ? PROVIDER_CATALOG[providerId] : null;
  const model = provider?.models.find((m) => m.id === modelId);

  return (
    <div
      className={cn(
        "group flex gap-4 px-6 py-5",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "assistant" && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-7 w-7 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-center">
            {provider ? (
              <Image
                src={provider.iconPath}
                alt=""
                width={14}
                height={14}
                className="opacity-70"
              />
            ) : (
              <div className="h-3 w-3 rounded-full bg-accent/50" />
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          "max-w-[75ch] space-y-2",
          role === "user" && "text-right"
        )}
      >
        {role === "assistant" && model && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted">
              {model.label}
            </span>
          </div>
        )}

        <div
          className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap",
            role === "user"
              ? "inline-block bg-surface-raised rounded-2xl rounded-br-md px-4 py-3 text-zinc-100"
              : "text-zinc-300"
          )}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-accent/70 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}
