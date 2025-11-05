import { db } from "@/db";
import { ateliers } from "@/db/schemas/ateliers";
import { creneaux } from "@/db/schemas/creneaux";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params

    try {
        const res = await db.select().from(creneaux).innerJoin(ateliers, eq(creneaux.atelierId, ateliers.id)).where(eq(ateliers.userId, userId))
    
        const data = res.map((r) => r.creanaux) 
        return NextResponse.json(data)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}