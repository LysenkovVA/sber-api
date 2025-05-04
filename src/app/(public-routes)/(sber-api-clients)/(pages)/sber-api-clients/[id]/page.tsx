import { Metadata } from "next";
import { EditSberApiClientWidget } from "@/app/(public-routes)/(sber-api-clients)/ui/EditSberApiClientWidget/EditSberApiClientWidget";

export const metadata: Metadata = {
    title: "SBER API",
};

export default async function SberApiClientDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <EditSberApiClientWidget sberApiClientId={id} />;
}
