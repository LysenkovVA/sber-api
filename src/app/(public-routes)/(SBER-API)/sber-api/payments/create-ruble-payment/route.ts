"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { createRublePayment } from "@/app/(public-routes)/(SBER-API)/sber-api/payments/create-ruble-payment/actions/createRublePayment";
import { RublePaymentEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/RublePaymentEntity";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<RublePaymentEntity | undefined>>> {
    // BODY
    const { accessToken, paymentData } = await request.json();

    try {
        // Проверка, что все параметры заданы
        if (!accessToken) {
            return ResponseData.BadRequest([
                "Параметр accessToken не задан",
            ]).toNextResponse();
        }

        if (!paymentData) {
            return ResponseData.BadRequest([
                "Параметр paymentData не задан",
            ]).toNextResponse();
        }

        return (
            await createRublePayment(accessToken, paymentData)
        ).toNextResponse();
    } catch (error) {
        return ResponseData.Error(error).toNextResponse();
    }
}
