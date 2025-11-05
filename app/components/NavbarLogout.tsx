"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DoorOpenIcon, GlobeIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useTransition } from "react";
import { logout } from "../(auth)/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { setLocale } from "@/i18n/setLocale";
import { User } from "@/db/schemas/users";
import Link from "next/link";

interface NavbarLogoutProps {
    user: User | null
}

const NavbarLogout = ({ user }: NavbarLogoutProps) => {
    const [pending, start] = useTransition()
    const router = useRouter()
    const t = useTranslations("Navbar")

    const handleLogOut = () => {
        start(async () => {
            const res = await logout()
            if (res?.ok) {
                router.push("/")
            } else {
                toast.error('Logout failed')
            }
        })
    }

    const handleChangeLang = (locale: string) => {
        start(async () => {
            await setLocale(locale)
            router.refresh()
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button disabled={pending} variant={"daisyPrimary"} size={"lg"} className="w-full flex-1 [&_svg:not([class*='size-'])]:size-5">
                    <span className=" sr-only">{t("Settings")}</span>
                    <SettingsIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" sideOffset={8}>
                <DropdownMenuLabel className="inline-flex items-center gap-1.5"><SettingsIcon className="size-4" /> {t("Settings")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger><GlobeIcon /> Language</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleChangeLang("en")}>English</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeLang("fr")}>Francais</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                {
                    user
                        ?
                        (
                            <DropdownMenuItem onClick={handleLogOut} className=" text-destructive"><DoorOpenIcon className="text-destructive" /> {t("Logout")}</DropdownMenuItem>
                        )
                        :
                        (
                            <DropdownMenuItem asChild>
                                <Link href={"/login"}><UserIcon /> Login</Link>
                            </DropdownMenuItem>
                        )
                }

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default NavbarLogout;