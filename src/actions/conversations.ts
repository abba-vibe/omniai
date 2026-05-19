"use server";

import { requireAuth } from "@/lib/auth";
import {
  getConversations as dbGetConversations,
  getConversation as dbGetConversation,
  createConversation as dbCreateConversation,
  deleteConversation as dbDeleteConversation,
  updateConversationTitle,
} from "@/lib/db/queries/conversations";

export async function getConversations() {
  const userId = await requireAuth();
  const convos = await dbGetConversations(userId);

  return convos.map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    messageCount: c._count.messages,
    lastProviderId: c.messages[0]?.providerId ?? null,
  }));
}

export async function getConversation(id: string) {
  const userId = await requireAuth();
  return dbGetConversation(id, userId);
}

export async function createConversation() {
  const userId = await requireAuth();
  const convo = await dbCreateConversation(userId);
  return { id: convo.id };
}

export async function renameConversation(id: string, title: string) {
  await requireAuth();
  await updateConversationTitle(id, title);
  return { success: true };
}

export async function removeConversation(id: string) {
  const userId = await requireAuth();
  await dbDeleteConversation(id, userId);
  return { success: true };
}
