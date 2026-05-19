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
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveApiKey(provider.id, apiKey.trim());
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

  const hasKey = config?.hasKey ?? false;

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between mb-4">
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

      {/* Key input */}
      {hasKey ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-10 rounded-lg border border-border bg-surface-raised px-3 flex items-center">
            <span className="text-sm text-zinc-500 font-mono tracking-wider">
              {"•".repeat(24)}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTest}
            loading={testing}
          >
            Test
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            loading={removing}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              type="password"
              placeholder={`Enter ${provider.name} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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
