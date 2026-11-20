
import type { Request, Response } from "express";
import { createChat } from "../services/chat.service.js";

export async function createChatController(
    req: Request,
    res: Response
) {
    try {
        const { userAId, userBId } = req.body;

        if (
            typeof userAId !== "string" ||
            typeof userBId !== "string" ||
            !userAId.trim() ||
            !userBId.trim()
        ) {
            return res.status(400).json({
                message: "Both userAId and userBId are required",
            });
        }

        const result = await createChat({
            userAId: userAId.trim(),
            userBId: userBId.trim(),
        });

        return res.status(result.isNewChat ? 201 : 200).json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        if (
            message === "Cannot create a chat with yourself" ||
            message === "One or both users do not exist"
        ) {
            return res.status(400).json({ message });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
