"use server";

import { ResponseData } from "@/app/lib/responses/ResponseData";
import fetch from "node-fetch";
import { getSberAgent } from "@/app/lib/sber/sberAgent";
import { RublePaymentErrorResponse } from "../../../../model/types/ruble-payments/responses/RublePaymentErrorResponse";
import { RublePaymentStatusErrorResponse } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/responses/RublePaymentStatusErrorResponse";
import { SberRublePaymentStatusEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/SberRublePaymentStatusEntity";

export async function getRublePaymentState(
    accessToken: string,
    externalId: string,
) {
    try {
        const standUrl = `${process.env.NEXT_PUBLIC_SBER_API_BASE_URL}/fintech/api/v1/payments/${externalId}/state`;
        const response = await fetch(standUrl, {
            agent: await getSberAgent(),
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                cache: "no-cache",
            },
        });

        if (!response.ok) {
            let responseData: RublePaymentErrorResponse = {};
            switch (response.status) {
                case 400:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.BadRequest([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 401:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.NotAuthorized([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.Forbidden([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 404:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.NotFound([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.TooManyRequests([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.Error([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode} JSON=${JSON.stringify(responseData.checks)}`,
                    ]);

                case 503:
                    responseData =
                        (await response.json()) as RublePaymentStatusErrorResponse;
                    return ResponseData.Error_503([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                default:
                    return ResponseData.Error([
                        "Ошибка при получении статуса рублевого платежного поручения!",
                    ]);
            }
        } else {
            const data: SberRublePaymentStatusEntity =
                (await response.json()) as SberRublePaymentStatusEntity;

            return ResponseData.Ok(data);
        }
    } catch (error) {
        return ResponseData.Error(error);
    }
}
