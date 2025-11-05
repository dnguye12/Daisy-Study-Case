import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { getCurrentUser } from "@/lib/session";
import { LockIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import WorkshopList from "./components/WorkshopList";

export default async function Home() {
  const t = await getTranslations("HomePage")
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="page-layout flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("Guest.Welcome")}</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-transparent">
                <Image
                  src={"/daisy.webp"}
                  alt="Daisy"
                  width={128}
                  height={100}
                />
              </EmptyMedia>
              <EmptyTitle className="font-semibold">{t("Guest.Title")}</EmptyTitle>
              <EmptyDescription>
                {t("Guest.Desc")}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex">
                <Button variant={"daisyPrimary"} className="rounded-lg" asChild>
                  <Link href={"/login"}>
                    <LockIcon /> {t("Guest.Login")}
                  </Link>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    )
  }

  return (
    <div className="page-layout flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t("User.Workshops")}</h1>
        <Link href={"/add-atelier"}>
          <Button size={"sm"} variant={"daisyPrimary"} className="rounded-md">{t("User.Add_Workshop")}</Button>
        </Link>
      </div>

      <WorkshopList userId={user.id}/>
    </div>
  );
}
