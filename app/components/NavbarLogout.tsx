"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DoorOpenIcon, GlobeIcon, SettingsIcon } from "lucide-react";
import { useTransition } from "react";
import { logout } from "../(auth)/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const NavbarLogout = () => {
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button disabled={pending} variant={"daisyPrimary"} size={"lg"} className="w-full flex-1 [&_svg:not([class*='size-'])]:size-5">
                    <span className=" sr-only">{t("Settings")}</span>
                    <SettingsIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" sideOffset={8}>
                <DropdownMenuLabel className="inline-flex items-center gap-1.5"><SettingsIcon className="size-4"/> {t("Settings")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><GlobeIcon /> English</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut} className=" text-destructive"><DoorOpenIcon className="text-destructive"/> {t("Logout")}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default NavbarLogout;