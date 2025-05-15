import { Metadata } from "next";
import { ON_SURFACE_COLOR } from "@/app/lib/themes/primary-theme";

export const metadata: Metadata = {
    title: "SBER API",
};

export default async function SberApiClientLoginDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <p style={{ color: ON_SURFACE_COLOR }}>{id}</p>;
}
