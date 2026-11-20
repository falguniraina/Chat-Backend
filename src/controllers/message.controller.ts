import { Request, Response } from "express";
import {
    sendMessage,
    getChatMessages,
    markMessageAsReadService,
    updateLastSeenService
} from "../services/message.service.js";
export async function sendMessageController(
    req: Request,
    res: Response
) {
    try {
        const { chatId } = req.params;
        const { senderId, text } = req.body;

        if (
            typeof chatId !== "string" ||
            typeof senderId !== "string" ||
            !senderId.trim()
        ) {
            return res.status(400).json({
                message: "Valid chatId and senderId are required"
            });
        }

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                message: "Message text is required"
            });
        }

        const result = await sendMessage({
            chatId,
            senderId: senderId.trim(),
            text
        });

        return res.status(201).json({
            message: "Message sent successfully",
            ...result
        });

    } catch (error) {

        if (
            error instanceof Error &&
            error.message === "Sender is not a member of this chat"
        ) {
            return res.status(403).json({
                message: error.message
            });
        }

        console.error("Send message error:", error);

        return res.status(500).json({
            message: "Failed to send message"
        });
    }
}
export async function getMessagesController(
    req: Request,
    res: Response
) {
    try {
        const { chatId } = req.params;

        const limitValue = req.query.limit ?? "50";
        const limit = Number(limitValue);

        if (
            typeof chatId !== "string" ||
            !chatId.trim()
        ) {
            return res.status(400).json({
                message: "Valid chatId is required"
            });
        }

        if (
            typeof limitValue !== "string" ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                message: "Limit must be between 1 and 100"
            });
        }

        const messages = await getChatMessages(
            chatId,
            limit
        );

        return res.status(200).json({
            chatId,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get messages error:", error);

        return res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
}

export async function markMessageAsReadController(
    req: Request,
    res: Response
) {
    try {
        const { chatId, messageId } = req.params;
        const { userId } = req.body;

        // Validate request parameters
        if (
            typeof chatId !== "string" ||
            !chatId.trim() ||
            typeof messageId !== "string" ||
            !messageId.trim() ||
            typeof userId !== "string" ||
            !userId.trim()
        ) {
            return res.status(400).json({
                message: "Valid chatId, messageId and userId are required"
            });
        }

        // Call service
        const result = await markMessageAsReadService(
            chatId.trim(),
            messageId.trim(),
            userId.trim()
        );

        return res.status(200).json({
            message: "Message marked as read successfully",
            ...result
        });

    } catch (error) {

        if (
            error instanceof Error &&
            error.message === "User is not a member of this chat"
        ) {
            return res.status(403).json({
                message: error.message
            });
        }

        if (
            error instanceof Error &&
            error.message === "Message not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        console.error("Mark message as read error:", error);

        return res.status(500).json({
            message: "Failed to mark message as read"
        });
    }
}

export async function updateLastSeenController(
    req: Request,
    res: Response
) {
    try {
        const { chatId } = req.params;
        const { userId, messageId } = req.body;

        if (
            typeof chatId !== "string" ||
            !chatId.trim() ||
            typeof userId !== "string" ||
            !userId.trim() ||
            typeof messageId !== "string" ||
            !messageId.trim()
        ) {
            return res.status(400).json({
                message: "Valid chatId, userId and messageId are required"
            });
        }

        const result = await updateLastSeenService(
            chatId.trim(),
            messageId.trim(),
            userId.trim()
        );

        return res.status(200).json({
            message: "Last seen updated successfully",
            ...result
        });

    } catch (error) {

        if (
            error instanceof Error &&
            error.message === "User is not a member of this chat"
        ) {
            return res.status(403).json({
                message: error.message
            });
        }

        if (
            error instanceof Error &&
            error.message === "Message not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        console.error("Update last seen error:", error);

        return res.status(500).json({
            message: "Failed to update last seen"
        });
    }
}
