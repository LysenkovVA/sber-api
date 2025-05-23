import { Metadata } from "next";
import { RublePaymentsCardList } from "@/app/(public-routes)/(payments)/ui/RublePaymentsCardList/RublePaymentsCardList";

export const metadata: Metadata = {
    title: "SBER API | Платежи",
};

export default async function SberApiPaymentsPage() {
    return <RublePaymentsCardList columnsCount={1} />;
}
