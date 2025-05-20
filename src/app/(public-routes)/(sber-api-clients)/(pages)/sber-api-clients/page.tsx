import { Metadata } from "next";
import { SberApiClientsCardList } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientsCardList/SberApiClientsCardList";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "SBER API",
};

export default async function SberApiClientsPage() {
    return (
        <Suspense>
            <SberApiClientsCardList columnsCount={1} />
        </Suspense>
    );
}
