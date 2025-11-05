"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    title: z.string().trim().min(1, "Workshop title cannot be empty"),
    description: z.string()
})

interface AddAtelierFormProps {
    userId: string
}

const AddAtelierForm = ({userId}: AddAtelierFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const t = useTranslations("Add_Workshop")
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: ""
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)

            const {title, description} = data
            const res = await fetch("/api/ateliers", {
                method: "POST",
                body: JSON.stringify({
                    userId,
                    title,
                    description
                })
            })

            if(res.ok) {
                toast.success(t("Create_Success"))
            }
        } catch (error) {
            console.log(error)
            toast.error(t("Create_Fail"))
        } finally {
            setIsLoading(false)
            form.reset()
            router.push("/")
        }
    }

    return (
        <div className="bg-white border rounded-lg p-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">{t("Title")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("Title_Placeholder")}
                                        autoFocus
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
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">{t("Desc")}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t("Desc_Placeholder")}
                                        className="bg-daisy-blue text-xs"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    ></FormField>
                    <Button type="submit" disabled={isLoading ||!form.formState.isValid} variant={"daisyPrimary"} size={"sm"} className="w-full rounded-lg">
                        {t("Submit")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddAtelierForm;