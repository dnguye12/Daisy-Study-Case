"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Atelier } from "@/db/schemas/ateliers";
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

interface EditAtelierFormProps {
    atelier: Atelier;
    onAddTimetable: () => void;
    setAtelier: Dispatch<SetStateAction<Atelier | null>>
}

const formSchema = z.object({
    title: z.string().min(1, "Title cannot be empty"),
    desc: z.string()
})

const EditAtelierForm = ({ atelier, onAddTimetable, setAtelier }: EditAtelierFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter()
    const t = useTranslations("Edit_Workshop")

    const form = useForm<z.input<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            title: atelier.title,
            desc: atelier.description
        }
    })

    const onSubmit = async (data: z.input<typeof formSchema>) => {
        setIsSubmitting(true)

        try {
            const res = await fetch(`/api/ateliers/${atelier.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    desc: data.desc
                })
            })
            const updated = await res.json()
            setAtelier(updated)
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            form.reset()
            onAddTimetable()
        }
    }

    const onDelete = async () => {
        setIsSubmitting(true)
        try {
            await fetch(`/api/ateliers/${atelier.id}`, { method: "DELETE" })
            router.push("/")
            router.refresh()
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white border rounded-lg p-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">{t("Title")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className=" bg-daisy-blue text-xs"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>

                    <FormField
                        control={form.control}
                        name="desc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">{t("Desc")}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="bg-daisy-blue text-xs"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>

                    <Button variant={"daisyPrimary"} size={"sm"} type="submit" disabled={!form.formState.isValid || isSubmitting} className="w-full rounded-lg mt-2">
                        <PencilIcon /> {t("Update")}
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"destructive"} size={"sm"} type="button" disabled={isSubmitting} className="w-full rounded-lg"><Trash2Icon />{t("Delete")}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>{t("Line1")}</DialogHeader>
                            <DialogDescription className="text-xs">
                                {t("Line2")}
                            </DialogDescription>
                            <DialogFooter className="flex flex-row items-center justify-end">
                                <DialogClose asChild>
                                    <Button variant={"outline"} size={"sm"} className="rounded-lg" disabled={isSubmitting}>{t("Cancel")}</Button>
                                </DialogClose>
                                <Button variant={"destructive"} size={"sm"} type="button" className="rounded-lg" onClick={onDelete} disabled={isSubmitting}>{t("Confirm")}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </form>
            </Form>
        </div>
    );
}

export default EditAtelierForm;