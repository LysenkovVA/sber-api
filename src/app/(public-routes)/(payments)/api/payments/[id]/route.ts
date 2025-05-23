"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { deletePaymentById } from "./actions/deleteSubjectById";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<RublePaymentEntity | undefined>>> {
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await deletePaymentById(id)).toNextResponse();
}
