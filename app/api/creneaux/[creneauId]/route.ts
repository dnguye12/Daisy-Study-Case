import { db } from "@/db";
import { creneaux } from "@/db/schemas/creneaux";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ creneauId: string }> }) {
    const { creneauId } = await params;

    try {
        await db.delete(creneaux).where(eq(creneaux.id, creneauId))
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}