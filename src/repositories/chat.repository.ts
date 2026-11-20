
import { pool } from "../config/database.js";

export async function createOrGetChat(
    userAId: string,
    userBId: string
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check that both users exist
        const users = await client.query(
            `SELECT id FROM users WHERE id = ANY($1::uuid[])`,
            [[userAId, userBId]]
        );

        if (users.rowCount !== 2) {
            throw new Error("One or both users do not exist");
        }

        // Normalize the IDs to avoid duplicate chats
        const [userLow, userHigh] = [userAId, userBId].sort();

        // Insert chat, or do nothing if it already exists
        const inserted = await client.query(
            `INSERT INTO chats (is_group, user_low, user_high)
       VALUES (FALSE, $1, $2)
       ON CONFLICT (user_low, user_high) DO NOTHING
       RETURNING id`,
            [userLow, userHigh]
        );

        let chatId: string;
        let isNewChat: boolean;

        if (inserted.rows.length > 0) {
            chatId = inserted.rows[0].id;
            isNewChat = true;

            await client.query(
                `INSERT INTO chat_members (chat_id, user_id)
         VALUES ($1, $2), ($1, $3)`,
                [chatId, userAId, userBId]
            );
        } else {
            const existing = await client.query(
                `SELECT id FROM chats
         WHERE user_low = $1 AND user_high = $2`,
                [userLow, userHigh]
            );

            chatId = existing.rows[0].id;
            isNewChat = false;
        }

        await client.query("COMMIT");

        return { chatId, isNewChat };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
