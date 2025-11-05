"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AtelierDescriptionProps {
    desc: string
}

const AtelierDescription = ({ desc }: AtelierDescriptionProps) => {
    const t = useTranslations("Atelier_Page")
    const [more, setMore] = useState<boolean>(false)

    return (
        <div className=" bg-daisy-card px-4 py-2 rounded-lg text-xs">
            <h2 className="font-semibold text-sm">{t("Desc")}</h2>
            <p className={cn(
                !more && "line-clamp-2"
            )}>{desc}
            </p>
            <Button variant={"link"} size={"sm"} className="text-xs text-muted-foreground p-0" onClick={() => { setMore(!more) }}>{more ? t("See_Less") : t("See_More")}</Button>
        </div>

    );
}

export default AtelierDescription;