"use client";

import { useState, useEffect, useCallback } from "react";
import { ProviderCard } from "@/components/settings/provider-card";
import { getProviderConfigs } from "@/actions/providers";
import { getAllProviders } from "@/lib/ai/providers";
import type { ProviderConfigClient } from "@/types/provider";

export default function ProvidersSettingsPage() {
  const [configs, setConfigs] = useState<ProviderConfigClient[]>([]);
  const [loading, setLoading] = useState(true);
  const providers = getAllProviders();

  const loadConfigs = useCallback(async () => {
    const data = await getProviderConfigs();
    setConfigs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          API Keys
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5 max-w-[55ch]">
          Connect your AI provider accounts. Keys are encrypted at rest and
          never leave the server.
        </p>
      </div>

      <div className="space-y-4">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-44 rounded-xl" />
            ))
          : providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                config={configs.find((c) => c.providerId === provider.id)}
                onUpdate={loadConfigs}
              />
            ))}
      </div>
    </div>
  );
}
