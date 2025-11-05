"use client"

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from '@fullcalendar/rrule';
import { useEffect, useState } from "react";
import CalendarToday from "./CalendarToday";

interface CalendarProps {
    userId: string
}

const Calendar = ({ userId }: CalendarProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/creneaux/by-user/${userId}`, {
                    method: "GET"
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
                        exdate: c.exdate
                    };
                }))
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [userId])

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
                    },
                    timeGridDay: {
                        eventTextColor: "white",
                        eventDisplay: "auto"
                    },
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
            />
            {selectedDate && <CalendarToday selectedDate={selectedDate} events={events} />}
        </div>
    );
}

export default Calendar;