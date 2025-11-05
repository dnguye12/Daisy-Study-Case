import { db } from "@/db";
import { creneaux, creneauxExdates } from "@/db/schemas/creneaux";
import { eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    if (!id) {
        return new NextResponse("Atelier ID missing", { status: 400 })
    }

    try {
        const series = await db.select().from(creneaux).where(eq(creneaux.atelierId, id))
        const seriresIds = series.map(s => s.id)

        const exdates = await db.select().from(creneauxExdates).where(inArray(creneauxExdates.creneauId, seriresIds))

        const exdatesBySeries = new Map<string, Date[]>()
        for(const ex of exdates) {
            const arr = exdatesBySeries.get(ex.creneauId) ?? []
            arr.push(ex.exdate)
            exdatesBySeries.set(ex.creneauId, arr)
        }

        const payload = [
            ...series.map(s => ({
                ...s,
                exdate: (exdatesBySeries.get(s.id) ?? []).map(d => d.toISOString())
            }))
        ]

        return NextResponse.json(payload)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}