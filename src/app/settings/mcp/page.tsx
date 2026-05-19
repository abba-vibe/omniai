"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface McpServer {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export default function McpSettingsPage() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !url.trim()) return;
    setServers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        url: url.trim(),
        isActive: true,
      },
    ]);
    setName("");
    setUrl("");
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            MCP Servers
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5 max-w-[55ch]">
            Connect Model Context Protocol servers to extend AI capabilities
            with external tools.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add server"}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-surface p-5 mb-6 space-y-4">
          <Input
            label="Server name"
            placeholder="My MCP Server"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="SSE Endpoint URL"
            placeholder="https://my-mcp-server.com/sse"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            hint="Only SSE transport is supported for remote servers"
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!name.trim() || !url.trim()}
            >
              Connect
            </Button>
          </div>
        </div>
      )}

      {servers.length === 0 && !showForm ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 py-16 text-center">
          <div className="h-12 w-12 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-6 w-6 text-zinc-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22v-5M9 7V2m6 5V2M6 13V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500 mb-1">No MCP servers connected</p>
          <p className="text-xs text-zinc-600 max-w-[40ch] mx-auto">
            Add a server to enable tool use across your AI providers
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {servers.map((server) => (
            <div
              key={server.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {server.name}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    {server.url}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Active</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(server.id)}
                >
                  <svg
                    className="h-4 w-4 text-zinc-500 hover:text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
