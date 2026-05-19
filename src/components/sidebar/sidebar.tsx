"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ConversationList } from "./conversation-list";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[280px] border-r border-border-subtle bg-surface/50 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border-subtle">
        <div className="h-7 w-7 rounded-lg bg-accent/15 flex items-center justify-center">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-base font-semibold tracking-tight text-zinc-100">
          OmniAI
        </span>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-hidden">
        <ConversationList />
      </div>

      {/* Bottom nav */}
      <div className="border-t border-border-subtle p-2 space-y-0.5">
        <Link
          href="/settings/providers"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname.startsWith("/settings")
              ? "text-accent bg-accent-muted"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-surface-raised"
          )}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Settings
        </Link>

        <div className="flex items-center gap-2.5 px-3 py-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
          <span className="text-xs text-zinc-500">Account</span>
        </div>
      </div>
    </aside>
  );
}
