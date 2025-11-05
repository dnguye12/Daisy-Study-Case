"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Atelier } from "@/db/schemas/ateliers";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WorkshopListProps {
    userId: string
}

const WorkshopList = ({ userId }: WorkshopListProps) => {
    const [ateliers, setAteliers] = useState<Atelier[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const t = useTranslations("HomePage")

    useEffect(() => {
        if (!userId || !isLoading) {
            return
        }
        (async () => {
            try {
                const res = await fetch(`/api/ateliers/user/${userId}`)
                const data = await res.json()

                setAteliers(data)
            } catch (error) {
                console.log(error)
                toast.error("Error loading workshops")
            } finally {
                setIsLoading(false)
            }
        })()
    }, [userId, isLoading])

    if (isLoading) {
        return (
            <div className="flex-1 ">
                <Skeleton className="h-3 w-32 bg-daisy-secondary mb-4" />
                <Skeleton className="w-full rounded-lg bg-daisy-secondary mb-2 h-48" />
                <Skeleton className="w-full rounded-lg bg-daisy-secondary mb-2 h-48" />
                <Skeleton className="w-full rounded-lg bg-daisy-secondary h-48" />
            </div>
        )
    }

    return (
        <div className="flex-1 ">
            <p className="text-muted-foreground text-xs mb-4">{t("User.Displaying", {count: ateliers.length})}</p>

            <div className="grid gap-2">
                {ateliers.map((atelier) => (
                    <Link href={`/atelier/${atelier.id}`} key={atelier.id} className="border rounded-lg bg-daisy-card overflow-hidden">
                        <img src={atelier.image} className="w-4/5 aspect-video mx-auto my-2" alt={atelier.title}/>
                        <div className="bg-white p-2">
                            <p className="font-medium text-sm">{atelier.title}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default WorkshopList;