import { getCurrentUser } from "@/lib/session";
import AddAtelierForm from "./components/AddAtelierForm";
import { getTranslations } from "next-intl/server";

const AddAtelier = async () => {
    const user = await getCurrentUser()
    const t = await getTranslations("Add_Workshop")

    if (!user) {
        return <div>...Loading</div>
    }

    return (
        <div className="page-layout">
            <h1 className="text-2xl font-semibold mb-6">{t("Add_Workshop")}</h1>
            <AddAtelierForm userId={user.id} />
        </div>
    );
}

export default AddAtelier;