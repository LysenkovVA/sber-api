"use server";

import { getSberAgent } from "@/app/lib/sber/sberAgent";
import fetch from "node-fetch";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberClientInfoEntity } from "@/app/(public-routes)/(SBER-API)/model/types/client-info/SberClientInfoEntity";
import { SberClientInfoErrorResponse } from "../../../model/types/client-info/responses/SberClientInfoErrorResponse";

export async function getClientInfo(accessToken: string) {
    // Получение информации о клиенте
    try {
        // Адрес стенда
        const standUrl = `https://iftfintech.testsbi.sberbank.ru:9443/fintech/api/v1/client-info`;

        const response = await fetch(standUrl, {
            agent: await getSberAgent(),
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            let responseData = undefined;
            switch (response.status) {
                case 400:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.BadRequest([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 401:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.NotAuthorized([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.Forbidden([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 404:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.NotAcceptable([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.TooManyRequests([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.Error([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 503:
                    responseData =
                        (await response.json()) as SberClientInfoErrorResponse;
                    return ResponseData.Error([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                default:
                    return ResponseData.Error(await response.json());
            }
        } else {
            const clientInfo: SberClientInfoEntity =
                (await response.json()) as SberClientInfoEntity;

            if (!clientInfo) {
                return ResponseData.Error(["Информация о клиенте отсутствует"]);
            }

            return ResponseData.Ok<SberClientInfoEntity>(clientInfo);
        }
    } catch (error) {
        return ResponseData.Error(error);
    }
}
