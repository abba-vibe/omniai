export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { buildModel } from "@/lib/ai/registry";
import { getUserWithConfigs } from "@/lib/db/queries/users";
import { getProviderConfigData } from "@/lib/db/queries/provider-configs";
import { createMessage } from "@/lib/db/queries/messages";

export async function POST(req: Request) {
  const session = await auth();
  if (!session.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, providerId, modelId, conversationId } = await req.json();

  const user = await getUserWithConfigs(session.userId);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const configData = await getProviderConfigData(
    session.userId,
    providerId,
    user.encryptionSalt
  );

  if (!configData) {
    return new Response(`No config for ${providerId}`, { status: 400 });
  }

  const { apiKey, customBaseUrl } = configData;

  // Ollama doesn't need a real API key
  if (!apiKey && providerId !== "ollama") {
    return new Response(`No API key configured for ${providerId}`, { status: 400 });
  }

  const model = buildModel(providerId, modelId, apiKey ?? "ollama", customBaseUrl);

  // Save user message
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user" && conversationId) {
    await createMessage({
      conversationId,
      role: "user",
      content:
        typeof lastUserMsg.content === "string"
          ? lastUserMsg.content
          : JSON.stringify(lastUserMsg.content),
    });
  }

  const result = streamText({
    model,
    messages,
    onFinish: async ({ text, usage }) => {
      if (conversationId) {
        await createMessage({
          conversationId,
          role: "assistant",
          content: text,
          providerId,
          modelId,
          metadata: {
            inputTokens: usage?.inputTokens,
            outputTokens: usage?.outputTokens,
          },
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
