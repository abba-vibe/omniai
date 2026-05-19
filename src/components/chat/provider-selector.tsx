"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PROVIDER_CATALOG } from "@/lib/ai/providers";
import type { ProviderId, ProviderConfigClient } from "@/types/provider";

interface ProviderSelectorProps {
  selectedProvider: ProviderId;
  selectedModel: string;
  onSelect: (providerId: ProviderId, modelId: string) => void;
  configuredProviders: ProviderConfigClient[];
}

export function ProviderSelector({
  selectedProvider,
  selectedModel,
  onSelect,
  configuredProviders,
}: ProviderSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentProvider = PROVIDER_CATALOG[selectedProvider];
  const currentModel = currentProvider?.models.find(
    (m) => m.id === selectedModel
  );
  const configuredIds = new Set(configuredProviders.map((c) => c.providerId));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5",
          "bg-surface-raised border border-border text-sm",
          "hover:bg-zinc-800 transition-colors duration-150",
          "active:scale-[0.98]"
        )}
      >
        {currentProvider && (
          <Image
            src={currentProvider.iconPath}
            alt=""
            width={16}
            height={16}
            className="opacity-70"
          />
        )}
        <span className="text-zinc-200 font-medium">
          {currentModel?.label ?? "Select model"}
        </span>
        <svg
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform duration-150",
            open && "rotate-180"
          )}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            "absolute bottom-full left-0 mb-2 w-64 z-50",
            "rounded-xl border border-border bg-surface p-1.5",
            "shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)]",
            "animate-in fade-in slide-in-from-bottom-2 duration-150"
          )}
        >
          {Object.values(PROVIDER_CATALOG).map((provider) => {
            const isConfigured = configuredIds.has(provider.id);
            return (
              <div key={provider.id} className="mb-1 last:mb-0">
                <div className="flex items-center gap-2 px-2.5 py-1.5">
                  <Image
                    src={provider.iconPath}
                    alt=""
                    width={14}
                    height={14}
                    className="opacity-50"
                  />
                  <span className="text-xs font-medium text-muted uppercase tracking-wider">
                    {provider.name}
                  </span>
                  {!isConfigured && (
                    <span className="ml-auto text-[10px] text-zinc-600">
                      No key
                    </span>
                  )}
                </div>
                {provider.models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    disabled={!isConfigured}
                    onClick={() => {
                      onSelect(provider.id, model.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                      "transition-colors duration-100",
                      isConfigured
                        ? "text-zinc-200 hover:bg-surface-raised cursor-pointer"
                        : "text-zinc-600 cursor-not-allowed",
                      selectedProvider === provider.id &&
                        selectedModel === model.id &&
                        "bg-accent-muted text-accent"
                    )}
                  >
                    <span>{model.label}</span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {model.contextWindow >= 1000000
                        ? `${(model.contextWindow / 1000000).toFixed(0)}M`
                        : `${(model.contextWindow / 1000).toFixed(0)}K`}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
