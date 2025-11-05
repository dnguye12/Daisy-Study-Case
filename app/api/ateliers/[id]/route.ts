import { db } from "@/db";
import { ateliers } from "@/db/schemas/ateliers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    if (!id) {
        return new NextResponse("Atelier ID missing", { status: 400 })
    }

    try {
        const [res] = await db.select().from(ateliers).where(eq(ateliers.id, id))

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const { title, desc } = body

    if (!id || !title) {
        return new NextResponse("Missing input", { status: 400 })
    }

    try {
        const [atelier] = await db.update(ateliers).set({
            title,
            description: desc
        }).where(eq(ateliers.id, id)).returning()

        return NextResponse.json(atelier)
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    if (!id) {
        return new NextResponse("Missing input", { status: 400 })
    }

    try {
        await db.delete(ateliers).where(eq(ateliers.id, id))
        return new NextResponse("Delete successfully", { status: 203 })
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}