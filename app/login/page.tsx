import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { getTranslations } from "next-intl/server";
import LoginForm from "./components/LoginForm";
import { redirect } from "next/navigation";

const LoginPage = async () => {
    const t = await getTranslations("Login")
    const user = await getCurrentUser()

    if (user) {
        redirect("/")
    }

    return (
        <div className="page-layout flex flex-col">
            <div className="flex-1 flex flex-col items-center py-4 gap-y-2">
                <Image
                    src={"/daisy.webp"}
                    alt="Daisy"
                    width={128}
                    height={100}
                    className="w-12"
                />
                <h2 className="font-semibold text-daisy-primary text-center text-xs">{t("Line1")}</h2>
                <p className="text-center text-xs text-muted-foreground mb-2">{t("Line2")}</p>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage;