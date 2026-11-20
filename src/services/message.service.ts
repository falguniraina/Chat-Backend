import {
  isChatMember,
  saveMessage,
  getMessages as fetchMessages,
  markMessageAsRead,
  updateLastSeen
} from "../repositories/message.repository.js";

interface SendMessageInput {
  chatId: string;
  senderId: string;
  text: string;
}

export async function sendMessage(input: SendMessageInput) {

  // Check whether sender belongs to this chat
  const isMember = await isChatMember(
    input.chatId,
    input.senderId
  );

  if (!isMember) {
    throw new Error("Sender is not a member of this chat");
  }

  // Save message in Firestore
  return await saveMessage(
    input.chatId,
    input.senderId,
    input.text.trim()
  );
}
export async function getChatMessages(
  chatId: string,
  limit: number
) {
  return await fetchMessages(chatId, limit);
}

export async function markMessageAsReadService(
  chatId: string,
  messageId: string,
  userId: string
) {
  // Check whether user belongs to this chat
  const isMember = await isChatMember(chatId, userId);

  if (!isMember) {
    throw new Error("User is not a member of this chat");
  }

  // Save read receipt
  return await markMessageAsRead(
    chatId,
    messageId,
    userId
  );
}

export async function updateLastSeenService(
  chatId: string,
  messageId: string,
  userId: string
) {
  // Check whether user belongs to this chat
  const isMember = await isChatMember(chatId, userId);

  if (!isMember) {
    throw new Error("User is not a member of this chat");
  }

  // Update last-seen information
  return await updateLastSeen(
    chatId,
    messageId,
    userId
  );
}
