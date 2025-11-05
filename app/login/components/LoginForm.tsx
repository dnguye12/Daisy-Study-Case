"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/app/(auth)/actions";

const formSchema = z.object({
    username: z.string().trim().min(1, "Username is required")
})

const LoginForm = () => {
    const [pending, start] = useTransition()
    const router = useRouter()
    const t = useTranslations("Login")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        start(async () => {
            const res = await login(data.username)

            if (res?.ok) {
                router.push("/")
            } else {
                form.setError("username", { message: res?.error ?? "Login failed" })
            }
        })
    }

    return (
        <div className="bg-white border rounded-lg p-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold">{t("Username")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. alan"
                                        autoFocus
                                        disabled={pending}
                                        className=" bg-daisy-blue text-xs"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>
                    <Button type="submit" variant={"daisyPrimary"} size={"sm"} disabled={pending ||!form.formState.isValid} className="w-full rounded-lg">
                        {t("Login")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default LoginForm;