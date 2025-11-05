"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn, isoDate } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

const weekdays = [
    { key: "MO", label: "Mon" },
    { key: "TU", label: "Tue" },
    { key: "WE", label: "Wed" },
    { key: "TH", label: "Thu" },
    { key: "FR", label: "Fri" },
    { key: "SA", label: "Sat" },
    { key: "SU", label: "Sun" },
] as const;

const formSchema = z.object({
    capacity: z.coerce.number().int().min(1, "Capacity needs to be at least 1"),
    date: z.date(),
    startTime: z.string(),
    endTime: z.string(),
    repeat: z.enum(["none", "DAILY", "WEEKLY", "MONTHLY"]).default("none"),
    byDay: z.array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"])).optional(),
    endKind: z.enum(["never", "untilDate", "count"]).default("never"),
    untilDate: z.date().optional(),
    count: z.coerce.number().int(),
})

interface AddCreneauFormProps {
    atelierId: string;
    atelierTitle: string;
    helperDate?: Date;
    onAddTimetable: () => void;
}

const AddCreneauForm = ({ atelierId, atelierTitle, helperDate = new Date(), onAddTimetable }: AddCreneauFormProps) => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const form = useForm<z.input<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            capacity: 1,
            date: helperDate,
            startTime: "14:00",
            endTime: "15:00",
            repeat: "none",
            byDay: [],
            endKind: "never",
            count: 6,
        },
    })

    const { repeat, endKind, untilDate, date } = form.watch();

    useEffect(() => {
        if (repeat !== "WEEKLY") {
            form.setValue("byDay", [])
        }
    }, [form, repeat])

    const timeError =
        form.watch("startTime") && form.watch("endTime") &&
            form.watch("endTime") <= form.watch("startTime")
            ? "End time must be after start time"
            : null;

    const endDateError =
        repeat !== "none" &&
            endKind === "untilDate" &&
            untilDate != null &&
            date != null &&
            new Date(untilDate).getTime() <= new Date(date).getTime()
            ? "End date must be after the start date"
            : null

    const onSubmit = async (data: z.input<typeof formSchema>) => {
        setIsSubmitting(true)

        try {
            const payload = {
                atelierId,
                title: atelierTitle,
                capacity: data.capacity,
                date: isoDate(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                recurrence:
                    data.repeat === "none"
                        ? null
                        : {
                            repeat: data.repeat,
                            byDay: data.repeat === "WEEKLY" ? data.byDay : undefined,
                            untilDate:
                                data.endKind === "untilDate" && data.untilDate
                                    ? isoDate(data.untilDate)
                                    : undefined,
                            count:
                                data.endKind === "count" && data.count
                                    ? data.count
                                    : undefined,
                        }
            }

            const res = await fetch(`/api/creneaux`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            form.reset()
            onAddTimetable()
        }
    }

    return (
        <div className="bg-white border rounded-lg p-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">Capacity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        className=" bg-daisy-blue text-xs"
                                        min={1}
                                        value={field.value === undefined || field.value === null ? "" : String(field.value)}
                                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>
                    <FormLabel className="text-xs font-semibold">Date & time</FormLabel>
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                className={cn(
                                                    "items-center justify-between bg-daisy-blue text-sm rounded-lg font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    ></FormField>
                    <div className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            type="time"
                                            step={60}
                                            {...field}
                                            className="bg-daisy-blue text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            type="time"
                                            step={60}
                                            {...field}
                                            className="bg-daisy-blue text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    </div>
                    {timeError ? <p className="text-sm text-destructive mt-2">{timeError}</p> : null}


                    <FormField
                        control={form.control}
                        name="repeat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">Repeat</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="bg-daisy-blue text-sm">
                                            <SelectValue placeholder="Doesn't repeat" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                        <SelectItem value="none">Doesn’t repeat</SelectItem>
                                        <SelectItem value="DAILY">Daily</SelectItem>
                                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    ></FormField>

                    {form.watch("repeat") === "WEEKLY" && (
                        <FormField
                            control={form.control}
                            name="byDay"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold">Weekly on</FormLabel>
                                    <div className="flex justify-between">
                                        {weekdays.map((w) => (
                                            <FormField
                                                key={w.key}
                                                control={form.control}
                                                name="byDay"
                                                render={({ field }) => {
                                                    const value = field.value || [];
                                                    const checked = value.includes(w.key);
                                                    return (
                                                        <FormItem className=" justify-items-center">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={checked}
                                                                    onCheckedChange={(ck) => {
                                                                        const next = ck
                                                                            ? [...value, w.key]
                                                                            : value.filter((d: string) => d !== w.key)
                                                                        field.onChange(next)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                            <FormLabel className="text-xs">{w.label}</FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            ></FormField>
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        ></FormField>
                    )}

                    {form.watch("repeat") !== "none" && (
                        <FormField
                            control={form.control}
                            name="endKind"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold">End repeat</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="never" id="end-never" />
                                                <label htmlFor="end-never" className="text-xs">
                                                    Never
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="untilDate" id="end-until" />
                                                <label htmlFor="end-until" className="text-xs">
                                                    On date
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="count" id="end-count" />
                                                <label htmlFor="end-count" className="text-xs">
                                                    After N occurrences
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    )}

                    {form.watch("repeat") !== "none" && form.watch("endKind") === "untilDate" && (
                        <FormField
                            control={form.control}
                            name="untilDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold">End date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    type="button"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "items-center justify-between bg-daisy-blue text-sm rounded-lg font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {endDateError ? <p className="text-sm text-destructive mt-2">{endDateError}</p> : null}
                                </FormItem>
                            )}
                        ></FormField>
                    )}

                    {form.watch("repeat") !== "none" && form.watch("endKind") === "count" && (
                        <FormField
                            control={form.control}
                            name="count"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold">Occurrences</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number" min={1}
                                            placeholder="6"
                                            value={field.value === undefined || field.value === null ? "" : String(field.value)}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                field.onChange(v === "" ? undefined : Number(v));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    )}

                    <Button variant={"daisyPrimary"} size={"sm"} type="submit" disabled={!!timeError || !!endDateError || !form.formState.isValid || isSubmitting} className="w-full rounded-lg mt-2">
                        Create
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddCreneauForm;