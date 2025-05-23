"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { getRublePayments } from "./actions/getRublePayments";
import { RublePaymentFilter } from "@/app/(public-routes)/(payments)/model/types/RublePaymentFilter";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<RublePaymentEntity[] | undefined>>> {
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
    const search = searchParams.get("search");

    // Объект фильтров
    const filters: OptionalRecord<RublePaymentFilter, string[]> = {};

    return (
        await getRublePayments(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
            search ?? "",
            filters,
        )
    ).toNextResponse();
}
