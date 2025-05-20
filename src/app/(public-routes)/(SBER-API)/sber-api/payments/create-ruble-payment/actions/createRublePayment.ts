"use server";

import {
    RublePaymentEntity,
    RublePaymentEntitySchema,
} from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";
import { validateObject } from "@/app/lib/validation/validateObject";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import fetch from "node-fetch";
import { getSberAgent } from "@/app/lib/sber/sberAgent";

interface ERROR_RUBLE_PAYMENT_RESPONSE {
    checks?: [
        {
            level?: string;
            message?: string;
            fields?: string[];
        },
    ];
    cause?: string;
    message?: string;
    referenceId?: string;
    internalErrorCode?: string;
}

export async function createRublePayment(
    accessToken: string,
    paymentData: RublePaymentEntity,
) {
    try {
        // Валидация
        const validatedData = await validateObject(
            RublePaymentEntitySchema,
            paymentData,
        );

        const standUrl = `${process.env.NEXT_PUBLIC_SBER_API_BASE_URL}/fintech/api/v1/payments`;
        const response = await fetch(standUrl, {
            agent: await getSberAgent(),
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                cache: "no-cache",
            },
            body: JSON.stringify(validatedData),
        });

        if (!response.ok) {
            let responseData: ERROR_RUBLE_PAYMENT_RESPONSE = {};
            switch (response.status) {
                case 400:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.BadRequest([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 401:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.NotAuthorized([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.Forbidden([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 404:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.NotFound([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.TooManyRequests([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.Error([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode} JSON=${JSON.stringify(responseData.checks)}`,
                    ]);

                case 503:
                    responseData =
                        (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                    console.error(
                        `Create payment error ${response.status}: `,
                        JSON.stringify(responseData, null, 2),
                    );
                    return ResponseData.Error_503([
                        `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                    ]);

                default:
                    return ResponseData.Error([
                        "Ошибка при создании рублевого платежного поручения!",
                    ]);
            }
        } else {
            if (response.status === 202) {
                const responseData =
                    (await response.json()) as ERROR_RUBLE_PAYMENT_RESPONSE;
                console.error(
                    `Create payment error ${response.status}: `,
                    JSON.stringify(responseData, null, 2),
                );
                return ResponseData.Ok_202([
                    `${responseData.cause}. ${responseData.message}. Код: ${responseData.internalErrorCode}`,
                ]);
            } else {
                const data: RublePaymentEntity =
                    (await response.json()) as RublePaymentEntity;

                return ResponseData.Ok_201(data);
            }
        }
    } catch (error) {
        return ResponseData.Error(error);
    }
}
