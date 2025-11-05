"use client"

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from '@fullcalendar/rrule';
import AtelierToday from "./AtelierToday";
import { useLocale } from "next-intl";

interface AtelierCalendarProps {
    atelierId: string;
    onAddTimetable?: () => void;
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
}

const AtelierCalendar = ({ atelierId, onAddTimetable, selectedDate, setSelectedDate }: AtelierCalendarProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [needFetch, setNeedFetch] = useState<boolean>(true)
    const locale = useLocale()

    useEffect(() => {
        (async () => {
            if (needFetch) {
                try {
                    const res = await fetch(`/api/ateliers/${atelierId}/creneaux`, {
                        method: "GET",
                        cache: "no-store"
                    })
                    const data = await res.json()
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setEvents(data.map((c: any) => {
                        const ms = new Date(c.endAt).getTime() - new Date(c.startAt).getTime()
                        return {
                            id: c.id,
                            title: c.title ?? "",
                            start: c.startAt,
                            end: c.endAt,
                            rrule: c.rrule ?? null,
                            duration: ms,
                            exdate: c.exdate,
                            price: c.price
                        };
                    }))

                    setNeedFetch(false)
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }
        })()
    }, [atelierId, needFetch])

    if (isLoading) {
        return <div>...Loading </div>
    }

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
                initialView="dayGridMonth"
                selectable={true}
                eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                height={"auto"}
                headerToolbar={{
                    start: "title",
                    center: "",
                    end: "today prev next dayGridMonth,timeGridWeek,timeGridDay",
                }}
                views={{
                    timeGridWeek: {
                        dayHeaderFormat: { weekday: "short" }
                    }
                }}
                events={events}
                displayEventTime={false}
                eventDisplay="block"
                eventTextColor="transparent"
                dateClick={(e) => { setSelectedDate(e.date) }}
                eventClick={(info) => {
                    const start = info.event.start

                    if (!start) {
                        return
                    }

                    const dayStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                    setSelectedDate(dayStart);
                }}
                locale={locale}
            />

            {selectedDate && <AtelierToday selectedDate={selectedDate} events={events} onAddTimetable={onAddTimetable} setNeedFetch={setNeedFetch} />}
        </div>
    );
}

export default AtelierCalendar;