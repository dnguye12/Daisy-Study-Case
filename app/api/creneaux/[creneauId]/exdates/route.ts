import { db } from "@/db";
import { creneaux, creneauxExdates } from "@/db/schemas/creneaux";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ creneauId: string }> }) {
    const { creneauId } = await params
    const { exdate } = await req.json()

    if (!exdate) {
        return new NextResponse("exdate required", { status: 400 })
    }

    const parent = await db.select().from(creneaux).where(eq(creneaux.id, creneauId)).limit(1)
    if (!parent.length) {
        return new NextResponse("Not found", { status: 404 })
    }

    await db.insert(creneauxExdates).values({
        creneauId,
        exdate: new Date(exdate)
    })

    return NextResponse.json({ ok: true })
}