"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function setLocale(locale: string) {
    const store = await cookies()

    store.set("locale", locale)

    revalidatePath("/", "layout")
}