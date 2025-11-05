import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import NavbarLogout from "./NavbarLogout";
import { getCurrentUser } from "@/lib/session";
import { getTranslations } from "next-intl/server";

const Navbar = async () => {
    const user = await getCurrentUser()
    const t = await getTranslations("Navbar")

    return (
        <nav className="flex items-center sticky bottom-0 left-0 bg-daisy-primary py-1 z-50">
            <Link href={"/"} className="flex-1">
                <Button variant={"daisyPrimary"} size={"lg"} className="w-full [&_svg:not([class*='size-'])]:size-5">
                    <span className=" sr-only">{t("Home")}</span>
                    <HouseIcon />
                </Button>
            </Link>
            <Link href={user ? "/calendar" : "/login"} className="flex-1">
                <Button variant={"daisyPrimary"} size={"lg"} className="w-full [&_svg:not([class*='size-'])]:size-5">
                    <span className=" sr-only">{t("Calender")}</span>
                    <CalendarDaysIcon />
                </Button>
            </Link>
            <NavbarLogout user={user}/>
        </nav>
    );
}

export default Navbar
    ;