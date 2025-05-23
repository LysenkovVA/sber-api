"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { getRublePaymentState } from "@/app/(public-routes)/(SBER-API)/sber-api/payments/ruble-payment-state/actions/getRublePaymentState";
import { SberRublePaymentStatusEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/SberRublePaymentStatusEntity";

export async function POST(
    request: NextRequest,
): Promise<
    NextResponse<ResponseData<SberRublePaymentStatusEntity | undefined>>
> {
    // BODY
    const { accessToken, externalId } = await request.json();

    try {
        // Проверка, что все параметры заданы
        if (!accessToken) {
            return ResponseData.BadRequest([
                "Параметр accessToken не задан",
            ]).toNextResponse();
        }

        if (!externalId) {
            return ResponseData.BadRequest([
                "Параметр externalId не задан",
            ]).toNextResponse();
        }

        return (
            await getRublePaymentState(accessToken, externalId)
        ).toNextResponse();
    } catch (error) {
        return ResponseData.Error(error).toNextResponse();
    }
}
