"use client"

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Atelier } from "@/db/schemas/ateliers";
import { CircleCheckIcon, PencilIcon, PlusIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import AddCreneauForm from "./components/AddCreneauForm";
import AtelierDescription from "./components/AtelierDescription";
import AtelierCalendar from "./components/AtelierCalendar";
import EditAtelierForm from "./components/EditAtelierForm";

const AtelierPage = ({ params }: { params: Promise<{ atelierId: string }> }) => {
    const { atelierId } = use(params)
    const [atelier, setAtelier] = useState<Atelier | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [mode, setMode] = useState<"default" | "addTimetable" | "editAtelier">("default")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    useEffect(() => {
        if (!isLoading) {
            return
        }

        (async () => {
            try {
                const res = await fetch(`/api/ateliers/${atelierId}`)
                const data = await res.json()

                setAtelier(data)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [atelierId, isLoading])

    if (isLoading) {
        <div className="page-layout">
            <Skeleton className="w-full aspect-video bg-daisy-secondary mb-4" />
            <Skeleton className="h-5 w-full bg-daisy-secondary mb-4" />
        </div>
    }

    console.log(atelier)

    return (
        <div className="page-layout flex flex-col gap-y-2">
            <img src={atelier?.image} className="w-full aspect-video mx-auto p-2 bg-white rounded-lg border" />
            <h1 className="font-medium text-sm">{atelier?.title}</h1>

            {
                mode === "default"
                &&
                (
                    <>
                        <div className="flex items-center gap-2">
                            <Button variant={"daisyPrimary"} size={"sm"} className="flex-1 rounded-md" onClick={() => { setMode("addTimetable") }}><PlusIcon /> Add a class</Button>
                            <Button variant={"daisyAccent"} size={"sm"} className="flex-1 rounded-md" onClick={() => { setMode("editAtelier") }}><PencilIcon /> Edit workshop</Button>
                        </div>
                        <AtelierDescription desc={atelier?.description ?? ""} />
                        <Separator />
                        <AtelierCalendar atelierId={atelierId} onAddTimetable={() => setMode("addTimetable")} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </>
                )
            }
            {
                mode === "addTimetable"
                &&
                (
                    <>
                        <div className="flex items-center">
                            <Button variant={"outline"} size={"sm"} className="flex-1 rounded-md" onClick={() => { setMode("default") }}><CircleCheckIcon /> Discard</Button>
                        </div>
                        <Separator />
                        <AddCreneauForm atelierId={atelier?.id ?? ""} atelierTitle={atelier?.title ?? ""} helperDate={selectedDate ? selectedDate : undefined} onAddTimetable={() => setMode("default")} />
                    </>
                )
            }
            {
                mode === "editAtelier" && atelier
                &&
                (
                    <>
                        <div className="flex items-center">
                            <Button variant={"outline"} size={"sm"} className="flex-1 rounded-md" onClick={() => { setMode("default") }}><CircleCheckIcon /> Discard</Button>
                        </div>
                        <Separator />
                        <EditAtelierForm atelier={atelier} onAddTimetable={() => setMode("default")} setAtelier={setAtelier}/>
                    </>
                )
            }
        </div >
    );
}

export default AtelierPage;