import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { timeFormat } from "@/lib/utils";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { rrulestr } from "rrule";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type DeleteMode = 'one' | 'all'

interface AtelierTodayProps {
    selectedDate: Date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: any[];
    onAddTimetable?: () => void;
    setNeedFetch: Dispatch<SetStateAction<boolean>>;
}

const AtelierToday = ({ selectedDate, events, onAddTimetable, setNeedFetch }: AtelierTodayProps) => {
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [deleteMode, setDeleteMode] = useState<DeleteMode>("one")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [itemToDelete, setItemToDelete] = useState<any | null>(null)
    const router = useRouter()
    const t = useTranslations("Atelier_Page")

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
                    if(isExcluded) {
                        continue
                    }
                    const end = new Date(start.getTime() + e.duration)
                    res.push({
                        id: `${e.id}`,
                        title: e.title,
                        start,
                        end,
                        rrule: e.rrule
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
                        end
                    })
                }
            }
        }

        res.sort((a, b) => a.start.getTime() - b.start.getTime())
        return res
    }, [events, selectedDate])

    const onDelete = async () => {
        if (!itemToDelete) {
            return
        }

        switch (deleteMode) {
            case "one":
                if (itemToDelete.rrule) {
                    await fetch(`/api/creneaux/${itemToDelete.id}/exdates`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ exdate: itemToDelete.start.toISOString() })
                    })
                } else {
                    await fetch(`/api/creneaux/${itemToDelete.id}`, {
                        method: "DELETE",
                    })
                }
                break
            case "all":
                await fetch(`/api/creneaux/${itemToDelete.id}`, {
                    method: "DELETE",
                })
                break
        }
        setOpenDelete(false)
        setItemToDelete(null)
        toast.success(t("Delete_Success"))
        router.refresh()
        setNeedFetch(true)
    }

    return (
        <>
            <Separator className="mt-2" />
            <div className="py-2 space-y-2">{items.map((item) => (
                <div key={item.id} className=" bg-daisy-accent rounded-lg p-2 text-white">
                    <p>{item.title || "Untitled"}</p>
                    <div className="flex justify-between items-center">
                        <p>{timeFormat(item.start)} - {timeFormat(item.end)}</p>
                        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                            <DialogTrigger asChild>
                                <Button variant={"ghost"} size={"icon-sm"} className="rounded-md" onClick={() => setItemToDelete(item)}><Trash2Icon /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>{t("Delete_Event")}</DialogTitle>
                                <RadioGroup value={deleteMode} onValueChange={(v) => setDeleteMode(v as DeleteMode)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="one" id="option-one" />
                                        <Label htmlFor="option-one">{t("Delete_This")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="option-two" />
                                        <Label htmlFor="option-two">{t("Delete_All")}</Label>
                                    </div>
                                </RadioGroup>
                                <Button variant={"daisyPrimary"} size={"sm"} className="w-full rounded-lg" onClick={onDelete}>{t("Delete")}</Button>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            ))}</div>
            <Separator />
            <Button size={"sm"} variant={"daisyPrimary"} onClick={onAddTimetable} className="mt-2 w-full rounded-lg"><PlusIcon />{t("Add_Class")}</Button>
        </>
    );
}

export default AtelierToday;