
import { getUserChats } from "../repositories/user.repository.js";

export async function getUserChatsService(userId: string) {
    return await getUserChats(userId);
}
