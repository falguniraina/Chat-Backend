
import { pool } from "../config/database.js";

export async function getUserChats(userId: string) {

    // Check whether user exists
    const userResult = await pool.query(
        `SELECT id FROM users WHERE id = $1`,
        [userId]
    );

    if (userResult.rowCount === 0) {
        throw new Error("User not found");
    }

    // Fetch all chats belonging to this user
    const result = await pool.query(
        `SELECT
            c.id AS "chatId",
            c.is_group AS "isGroup",
            c.created_at AS "createdAt",

            COALESCE(
                json_agg(
                    json_build_object(
                        'userId', u.id,
                        'name', u.name,
                        'email', u.email
                    )
                    ORDER BY u.name
                ) FILTER (WHERE u.id IS NOT NULL),
                '[]'::json
            ) AS members

        FROM chats c

        JOIN chat_members my_members
            ON my_members.chat_id = c.id
            AND my_members.user_id = $1

        LEFT JOIN chat_members cm
            ON cm.chat_id = c.id

        LEFT JOIN users u
            ON u.id = cm.user_id

        GROUP BY c.id

        ORDER BY c.created_at DESC`,
        [userId]
    );

    return result.rows;
}
