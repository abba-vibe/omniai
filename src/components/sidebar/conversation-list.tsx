"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import {
  getConversations,
  createConversation,
  removeConversation,
} from "@/actions/conversations";
import type { Conversation } from "@/types/conversation";

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getConversations().then((convos) => {
      setConversations(convos as Conversation[]);
      setLoading(false);
    });
  }, [pathname]);

  const handleNew = async () => {
    const { id } = await createConversation();
    router.push(`/chat/${id}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (pathname === `/chat/${id}`) {
      router.push("/chat");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <button
          type="button"
          onClick={handleNew}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5",
            "bg-surface-raised border border-border text-sm font-medium text-zinc-200",
            "hover:bg-zinc-800 active:scale-[0.98] transition-all duration-150"
          )}
        >
          <svg
            className="h-4 w-4 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="space-y-2 px-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-zinc-600">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((convo) => {
              const isActive = pathname === `/chat/${convo.id}`;
              return (
                <Link
                  key={convo.id}
                  href={`/chat/${convo.id}`}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2.5",
                    "text-sm transition-colors duration-100",
                    isActive
                      ? "bg-accent-muted text-accent"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-surface-raised"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[13px]">
                      {convo.title || "Untitled"}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {formatRelativeTime(convo.updatedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(convo.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700 transition-opacity"
                  >
                    <svg
                      className="h-3.5 w-3.5 text-zinc-500 hover:text-danger"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
