import { db } from "../prisma";

export async function getConversations(userId: string) {
  return db.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { content: true, providerId: true },
      },
      _count: { select: { messages: true } },
    },
  });
}

export async function getConversation(id: string, userId: string) {
  return db.conversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createConversation(userId: string, title?: string) {
  return db.conversation.create({
    data: { userId, title },
  });
}

export async function updateConversationTitle(id: string, title: string) {
  return db.conversation.update({
    where: { id },
    data: { title },
  });
}

export async function deleteConversation(id: string, userId: string) {
  return db.conversation.deleteMany({
    where: { id, userId },
  });
}
