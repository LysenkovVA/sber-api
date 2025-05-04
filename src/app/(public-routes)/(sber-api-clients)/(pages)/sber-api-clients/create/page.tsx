import { Metadata } from "next";
import { EditSberApiClientWidget } from "@/app/(public-routes)/(sber-api-clients)/ui/EditSberApiClientWidget/EditSberApiClientWidget";

export const metadata: Metadata = {
    title: "SBER API",
};

export default async function SberApiClientCreatePage() {
    return <EditSberApiClientWidget />;
}
