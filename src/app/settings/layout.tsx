import Link from "next/link";
import { Sidebar } from "@/components/sidebar/sidebar";

const settingsNav = [
  { href: "/settings/providers", label: "API Keys", icon: "key" },
  { href: "/settings/mcp", label: "MCP Servers", icon: "plug" },
];

const icons: Record<string, React.ReactNode> = {
  key: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  plug: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5M9 7V2m6 5V2M6 13V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" />
    </svg>
  ),
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh]">
      <Sidebar />
      <div className="flex-1 flex overflow-hidden">
        <nav className="w-52 border-r border-border-subtle p-3 space-y-0.5 shrink-0">
          <h2 className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Settings
          </h2>
          {settingsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-surface-raised transition-colors"
            >
              {icons[item.icon]}
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
