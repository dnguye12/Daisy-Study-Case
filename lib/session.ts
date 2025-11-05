import { db } from "@/db";
import { User, users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session_user_id";

export const getCurrentUser = async (): Promise<User | null> => {
    const cookie = (await cookies()).get(SESSION_COOKIE)

    if (!cookie?.value) {
        return null
    }

    const [user] = await db.select().from(users).where(eq(users.id, cookie.value))

    return user ?? null
}