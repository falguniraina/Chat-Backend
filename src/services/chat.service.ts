
import { createOrGetChat } from "../repositories/chat.repository.js";

interface CreateChatInput {
  userAId: string;
  userBId: string;
}

export async function createChat(input: CreateChatInput) {
  if (input.userAId === input.userBId) {
    throw new Error("Cannot create a chat with yourself");
  }

  return createOrGetChat(input.userAId, input.userBId);
}
