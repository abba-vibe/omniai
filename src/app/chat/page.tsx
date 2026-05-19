export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createConversation } from "@/actions/conversations";

export default async function ChatPage() {
  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  // Auto-create a new conversation and redirect
  const { id } = await createConversation();
  redirect(`/chat/${id}`);
}
