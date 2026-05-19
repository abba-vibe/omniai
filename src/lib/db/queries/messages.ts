import { Prisma } from "@prisma/client";
import { db } from "../prisma";

export async function createMessage(data: {
  conversationId: string;
  role: string;
  content: string;
  providerId?: string;
  modelId?: string;
  toolCalls?: Prisma.InputJsonValue;
  toolResults?: Prisma.InputJsonValue;
  metadata?: Prisma.InputJsonValue;
  parentId?: string;
}) {
  const message = await db.message.create({ data });

  // Update conversation timestamp
  await db.conversation.update({
    where: { id: data.conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getMessages(conversationId: string) {
  return db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getMessageBranches(parentId: string) {
  return db.message.findMany({
    where: { parentId },
    orderBy: { createdAt: "asc" },
  });
}
