import { Metadata } from "next";
import { SberApiClientsCardList } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientsCardList/SberApiClientsCardList";

export const metadata: Metadata = {
    title: "SBER API",
};

export default async function SberApiClientsPage() {
    return <SberApiClientsCardList columnsCount={1} />;
}
