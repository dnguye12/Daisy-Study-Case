import { db } from "@/db";
import { ateliers } from "@/db/schemas/ateliers";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params

    if (!userId) {
        return new NextResponse("User ID missing", { status: 400 })
    }

    try {
        const res = await db.select().from(ateliers).where(eq(ateliers.userId, userId)).orderBy(asc(ateliers.createdAt));

        if (res) {
            return NextResponse.json(res)
        } else {
            return new NextResponse("Internal Error", { status: 500 })
        }
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}