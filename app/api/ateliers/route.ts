import { db } from "@/db";
import { ateliers } from "@/db/schemas/ateliers";
import { NextRequest, NextResponse } from "next/server";

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg"
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, title, description } = body

        const image = images[Math.floor(Math.random() * images.length)]

        const [atelier] = await db.insert(ateliers).values({
            userId,
            title,
            description,
            image
        }).returning()

        return NextResponse.json(atelier)
    } catch (err) {
        console.log(err)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}