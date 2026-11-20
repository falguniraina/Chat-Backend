import { pool } from "../config/database.js";
import { firestore } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

export async function isChatMember(
    chatId: string,
    userId: string
): Promise<boolean> {

    const result = await pool.query(
        `SELECT 1
     FROM chat_members
     WHERE chat_id = $1 AND user_id = $2`,
        [chatId, userId]
    );

    return (result.rowCount ?? 0) > 0;
}

export async function saveMessage(
    chatId: string,
    senderId: string,
    text: string
) {

    const messageRef = firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc();

    await messageRef.set({
        id: messageRef.id,
        senderId,
        text,
        createdAt: FieldValue.serverTimestamp()
    });

    return {
        messageId: messageRef.id,
        chatId,
        senderId,
        text
    };
}

export async function getMessages(
    chatId: string,
    limit: number
) {
    const snapshot = await firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

    const messages = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            senderId: data.senderId,
            text: data.text,
            createdAt: data.createdAt?.toDate?.().toISOString() ?? null
        };
    });

    // Return messages in chronological order
    return messages.reverse();
}

export async function markMessageAsRead(
    chatId: string,
    messageId: string,
    userId: string
) {
    const messageRef = firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messageId);

    // Check whether the message exists
    const messageSnapshot = await messageRef.get();

    if (!messageSnapshot.exists) {
        throw new Error("Message not found");
    }

    // Create a read receipt for this user
    await messageRef
        .collection("readReceipts")
        .doc(userId)
        .set({
            userId,
            readAt: FieldValue.serverTimestamp()
        });

    return {
        chatId,
        messageId,
        userId,
        status: "read"
    };
}

export async function updateLastSeen(
    chatId: string,
    messageId: string,
    userId: string
) {
    // Find the message in this chat
    const messageRef = firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messageId);

    const messageSnapshot = await messageRef.get();

    if (!messageSnapshot.exists) {
        throw new Error("Message not found");
    }

    // Store the user's last-seen message
    await firestore
        .collection("chats")
        .doc(chatId)
        .collection("lastSeen")
        .doc(userId)
        .set({
            userId,
            messageId,
            lastSeenAt: FieldValue.serverTimestamp()
        });

    return {
        chatId,
        userId,
        messageId,
        status: "updated"
    };
}
