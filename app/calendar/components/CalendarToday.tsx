import { Separator } from "@/components/ui/separator";
import { timeFormat } from "@/lib/utils";
import { useMemo } from "react";
import { rrulestr } from "rrule";

interface CalendarTodayProps {
    selectedDate: Date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: any[],
}

const CalendarToday = ({ selectedDate, events }: CalendarTodayProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = useMemo<any[]>(() => {
        const dayStart = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0, 0, 0, 0
        );

        const dayEnd = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            23, 59, 59, 999
        );

        const res = []
        for (const e of events) {
            const exdateDates: Date[] = (e.exdate ?? []).map((x: string | number | Date) => new Date(x))
            const exdateMs = new Set(exdateDates.map(d => d.getTime()))
            if (e.rrule) {
                const rule = rrulestr(e.rrule)

                const dates = rule.between(dayStart, dayEnd, true)
                for (const dt of dates) {
                    const start = new Date(dt)
                    const isExcluded = exdateMs.has(start.getTime())
                    if (isExcluded) {
                        continue
                    }
                    const end = new Date(start.getTime() + e.duration)
                    res.push({
                        id: `${e.id}`,
                        title: e.title,
                        start,
                        end,
                        rrule: e.rrule,
                        price: e.price
                    })
                }
            } else {
                const start = new Date(e.start)
                const end = e.end ? new Date(e.end) : new Date(start.getTime() + (e.duration ?? 0))
                if (start <= dayEnd && end >= dayStart) {
                    res.push({
                        id: `${e.id}`,
                        title: e.title,
                        start,
                        end,
                        price: e.price
                    })
                }
            }
        }

        res.sort((a, b) => a.start.getTime() - b.start.getTime())
        return res
    }, [events, selectedDate])

    return (
        <>
            <Separator className="mt-2" />
            <div className="py-2 space-y-2">{items.map((item) => (
                <div key={item.id} className=" bg-daisy-accent rounded-lg p-2 text-white">
                    <p>{item.title || "Untitled"}</p>
                    <div className="flex flex-col">
                        <p>{timeFormat(item.start)} - {timeFormat(item.end)}</p>
                        <p>€{item.price}</p>
                    </div>
                </div>
            ))}</div>
        </>
    );
}

export default CalendarToday;