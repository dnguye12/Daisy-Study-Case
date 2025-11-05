import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parse } from "date-fns";
import { Options, RRule } from "rrule";
import { db } from "@/db";
import { creneaux } from "@/db/schemas/creneaux";

const bodySchema = z.object({
    atelierId: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    title: z.string().optional(),
    capacity: z.number().int().min(0).default(0),
    recurrence: z
        .object({
            repeat: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
            byDay: z.array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"])).optional(),
            untilDate: z.string().optional(),
            count: z.number().int().positive().optional(),
        })
        .nullable()
        .default(null),
})

export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
        const input = bodySchema.parse(json)

        const startLocal = parse(
            `${input.date} ${input.startTime}`,
            "yyyy-MM-dd HH:mm",
            new Date()
        );

        const endLocal = parse(
            `${input.date} ${input.endTime}`,
            "yyyy-MM-dd HH:mm",
            new Date()
        );

        let rruleText: string | null = null
        if (input.recurrence) {
            const opts: Partial<Options> = {
                freq: input.recurrence.repeat === "DAILY"
                    ? RRule.DAILY
                    : input.recurrence.repeat === "WEEKLY"
                        ? RRule.WEEKLY
                        : RRule.MONTHLY,
                dtstart: startLocal
            }

            if (input.recurrence.byDay && input.recurrence.byDay.length) {
                opts.byweekday = input.recurrence.byDay.map((d) => RRule[d])
            }

            if (input.recurrence.untilDate) {
                const untilLocal = parse(
                    `${input.recurrence.untilDate} ${input.endTime}`,
                    "yyyy-MM-dd HH:mm",
                    new Date()
                )
                opts.until = untilLocal
            }

            if (input.recurrence.count) {
                opts.count = input.recurrence.count
            }
            rruleText = new RRule(opts).toString()
        }

        const [creneau] = await db.insert(creneaux).values({
            atelierId: input.atelierId,
            title: input.title,
            capacity: input.capacity,
            startAt: startLocal,
            endAt: endLocal,
            rrule: rruleText ?? null
        }).returning()

        return NextResponse.json(creneau)
    } catch (error) {
        console.log(error)

        return new NextResponse('Internal Server Error', { status: 500 })
    }
}