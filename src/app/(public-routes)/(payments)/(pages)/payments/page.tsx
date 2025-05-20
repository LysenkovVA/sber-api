import { Metadata } from "next";
import { ON_SURFACE_COLOR } from "@/app/lib/themes/primary-theme";

export const metadata: Metadata = {
    title: "SBER API | Платежи",
};

export default async function SberApiPaymentsPage() {
    return <div style={{ color: ON_SURFACE_COLOR }}>{"Платежи"}</div>;
}
