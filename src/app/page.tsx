import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const providers = [
  { name: "Claude", icon: "/providers/anthropic.svg" },
  { name: "ChatGPT", icon: "/providers/openai.svg" },
  { name: "Gemini", icon: "/providers/google.svg" },
  { name: "Qwen", icon: "/providers/qwen.svg" },
  { name: "Kimi", icon: "/providers/kimi.svg" },
];

const features = [
  {
    title: "One interface, every model",
    description:
      "Switch between Claude, GPT, Gemini, Qwen, and Kimi mid-conversation. Your keys, your data.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Side-by-side comparison",
    description:
      "Send the same prompt to multiple models. See which gives the best response for your use case.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="1" />
        <rect x="14" y="3" width="7" height="18" rx="1" />
      </svg>
    ),
  },
  {
    title: "MCP tool integration",
    description:
      "Connect external tools via Model Context Protocol. Use them from any provider that supports tool calling.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-5M9 7V2m6 5V2M6 13V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" />
      </svg>
    ),
  },
  {
    title: "Encrypted key storage",
    description:
      "AES-256-GCM encryption with per-user key derivation. Your API keys never leave the server unencrypted.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session.userId) redirect("/chat");

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Nav */}
      <header className="flex items-center justify-between max-w-[1200px] mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-100">
            OmniAI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-accent text-zinc-950 px-4 py-2 rounded-xl hover:bg-accent-hover transition-colors active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero: left-aligned per design-taste-frontend ANTI-CENTER BIAS */}
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none text-zinc-50 mb-6">
              Every AI model,
              <br />
              <span className="text-accent">one workspace</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-[50ch] mb-10">
              Connect your own API keys for Claude, ChatGPT, Gemini, Qwen, and
              Kimi. Switch models mid-conversation. Compare responses side by
              side. All tools in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-accent text-zinc-950 font-medium text-base hover:bg-accent-hover active:scale-[0.98] transition-all"
              >
                Start for free
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-border text-zinc-300 text-base hover:bg-surface-raised active:scale-[0.98] transition-all"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Provider orbs */}
          <div className="lg:col-span-2 flex flex-wrap gap-4 lg:justify-end lg:pt-6">
            {providers.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-border-subtle hover:border-border hover:bg-surface-raised transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center group-hover:border-accent/30 transition-colors">
                  <Image
                    src={p.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="opacity-60 group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features: asymmetric 2-col grid, not 3 equal cards */}
      <section className="max-w-[1200px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`rounded-2xl border border-border-subtle bg-surface/50 p-8 ${i === 0 ? "md:row-span-2 flex flex-col justify-between" : ""}`}
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-[45ch]">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="text-xs text-zinc-600">OmniAI</span>
          <span className="text-xs text-zinc-600">
            Your keys. Your data. Your models.
          </span>
        </div>
      </footer>
    </div>
  );
}
