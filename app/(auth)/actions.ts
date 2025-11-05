"use server";

import { db } from "@/db"
import { users } from "@/db/schemas/users"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

const SESSION_COOKIE = "session_user_id";

export async function login(raw: string) {
    const username = typeof raw === "string" ? raw.trim() : ""

    let [user] = await db.select().from(users).where(eq(users.name, username))

    if (!user) {
        try {
            const [newUser] = await db.insert(users).values({
                name: username
            }).returning()

            user = newUser
        } catch (err) {
            [user] = await db.select().from(users).where(eq(users.name, username))

            if (!user) {
                console.log(err)
                return {
                    ok: false as const,
                    error: "Could not create user"
                }
            }
        }
    }

    (await cookies()).set({
        name: SESSION_COOKIE,
        value: user.id,
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    })

    return {
        ok: true as const,
        userId: user.id
    }
}

export async function logout() {
    (await cookies()).set({
        name: SESSION_COOKIE,
        value: "",
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 0,
    })

    return { ok: true as const }
}