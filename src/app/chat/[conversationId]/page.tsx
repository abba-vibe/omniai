export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { getConversation } from "@/actions/conversations";
import { getProviderConfigs } from "@/actions/providers";
import { getOrCreateUser } from "@/lib/db/queries/users";
import type { ProviderId } from "@/types/provider";

interface ChatConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ChatConversationPage({
  params,
}: ChatConversationPageProps) {
  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  const { conversationId } = await params;

  // Ensure user exists in DB
  const email =
    session.sessionClaims?.email as string | undefined;
  await getOrCreateUser(session.userId, email ?? "");

  const [conversation, configuredProviders] = await Promise.all([
    getConversation(conversationId),
    getProviderConfigs(),
  ]);

  if (!conversation) redirect("/chat");

  const initialMessages = conversation.messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  // Pick default provider: first configured one, or anthropic
  const firstConfigured = configuredProviders[0]?.providerId as ProviderId | undefined;
  const defaultProvider = firstConfigured ?? "anthropic";

  // Pick default model from catalog
  const { PROVIDER_CATALOG } = await import("@/lib/ai/providers");
  const defaultModel =
    PROVIDER_CATALOG[defaultProvider]?.models[0]?.id ??
    "claude-sonnet-4-20250514";

  return (
    <ChatInterface
      conversationId={conversationId}
      initialMessages={initialMessages}
      configuredProviders={configuredProviders}
      defaultProvider={defaultProvider}
      defaultModel={defaultModel}
    />
  );
}
