
import { Request, Response } from "express";
import { getUserChatsService } from "../services/user.service.js";

export async function getUserChatsController(
    req: Request,
    res: Response
) {
    try {
        const { userId } = req.params;

        if (
            typeof userId !== "string" ||
            !userId.trim()
        ) {
            return res.status(400).json({
                message: "Valid userId is required"
            });
        }

        const chats = await getUserChatsService(userId.trim());

        return res.status(200).json({
            userId,
            count: chats.length,
            chats
        });

    } catch (error) {

        if (
            error instanceof Error &&
            error.message === "User not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        console.error("Get user chats error:", error);

        return res.status(500).json({
            message: "Failed to fetch user chats"
        });
    }
}
