"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { saveApiKey, removeApiKey, testApiKey } from "@/actions/providers";
import type { ProviderDefinition } from "@/types/provider";
import type { ProviderConfigClient } from "@/types/provider";

interface ProviderCardProps {
  provider: ProviderDefinition;
  config?: ProviderConfigClient;
  onUpdate: () => void;
}

export function ProviderCard({ provider, config, onUpdate }: ProviderCardProps) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("http://localhost:11434");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const isOllama = provider.id === "ollama";
  const hasKey = config?.hasKey ?? false;

  const handleSave = async () => {
    if (!isOllama && !apiKey.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveApiKey(
        provider.id,
        isOllama ? "ollama" : apiKey.trim(),
        isOllama ? baseUrl.trim() : undefined
      );
      setApiKey("");
      onUpdate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testApiKey(provider.id);
      setTestResult(result);
      onUpdate();
    } catch (e) {
      setTestResult({
        success: false,
        error: e instanceof Error ? e.message : "Test failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeApiKey(provider.id);
      onUpdate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center">
            <Image
              src={provider.iconPath}
              alt=""
              width={20}
              height={20}
              className="opacity-70"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              {provider.name}
            </h3>
            <p className="text-xs text-zinc-500">{provider.description}</p>
          </div>
        </div>
        {hasKey && (
          <Badge
            variant={
              config?.lastTestSuccess === true
                ? "success"
                : config?.lastTestSuccess === false
                  ? "danger"
                  : "muted"
            }
          >
            {config?.lastTestSuccess === true
              ? "Connected"
              : config?.lastTestSuccess === false
                ? "Failed"
                : "Configured"}
          </Badge>
        )}
      </div>

      {/* Free tier note */}
      {provider.freeKeyNote && (
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-[11px] text-emerald-400 font-medium">
            ✦ {provider.freeKeyNote}
          </span>
          {provider.freeKeyUrl && !hasKey && (
            <a
              href={provider.freeKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-accent hover:text-accent/80 underline underline-offset-2 transition-colors ml-1"
            >
              Get free key →
            </a>
          )}
        </div>
      )}

      {/* Models list */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {provider.models.map((model) => (
          <span
            key={model.id}
            className="inline-flex items-center rounded-md bg-zinc-800/50 px-2 py-0.5 text-[11px] text-zinc-400 font-mono"
          >
            {model.label}
          </span>
        ))}
      </div>

      {/* Input area */}
      {hasKey ? (
        <div className="space-y-2">
          {isOllama && config?.customBaseUrl && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-zinc-500 font-mono truncate">{config.customBaseUrl}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-10 rounded-lg border border-border bg-surface-raised px-3 flex items-center">
              <span className="text-sm text-zinc-500 font-mono tracking-wider">
                {isOllama ? "● Local Ollama server" : "•".repeat(24)}
              </span>
            </div>
            <Button variant="secondary" size="sm" onClick={handleTest} loading={testing}>
              Test
            </Button>
            <Button variant="danger" size="sm" onClick={handleRemove} loading={removing}>
              Remove
            </Button>
          </div>
        </div>
      ) : isOllama ? (
        /* Ollama: URL input, no API key needed */
        <div className="space-y-2">
          <div className="rounded-lg border border-border-subtle bg-zinc-900/50 px-3 py-2 text-xs text-zinc-400 leading-relaxed">
            Ollama must be running locally. Install from{" "}
            <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              ollama.ai
            </a>{" "}
            then run <code className="font-mono text-zinc-300">ollama pull llama3.2</code>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="http://localhost:11434"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                error={error ?? undefined}
              />
            </div>
            <Button onClick={handleSave} loading={saving}>
              Connect
            </Button>
          </div>
        </div>
      ) : (
        /* Standard: API key input */
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              type="password"
              placeholder={`Enter ${provider.name} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              error={error ?? undefined}
            />
          </div>
          <Button onClick={handleSave} loading={saving} disabled={!apiKey.trim()}>
            Save
          </Button>
        </div>
      )}

      {/* Test result */}
      {testResult && (
        <div
          className={cn(
            "mt-3 rounded-lg px-3 py-2 text-xs",
            testResult.success
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          )}
        >
          {testResult.success
            ? "Connection successful"
            : `Connection failed: ${testResult.error}`}
        </div>
      )}
    </div>
  );
}
