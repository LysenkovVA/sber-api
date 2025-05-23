"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";
import { updatePaymentStatus } from "@/app/(public-routes)/(payments)/api/payments/[id]/update-status/actions/updatePaymentStatus";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<RublePaymentEntity | undefined>>> {
    const { id } = await props.params;
    const { newStatus } = await request.json();

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    if (!newStatus) {
        return ResponseData.BadRequest([
            "Новый статус не задан",
        ]).toNextResponse();
    }

    return (await updatePaymentStatus(id, newStatus)).toNextResponse();
}
