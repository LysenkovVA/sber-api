"use server";

import { getSberAgent } from "@/app/lib/sber/sberAgent";
import fetch from "node-fetch";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberUserInfoEntity } from "@/app/(public-routes)/(SBER-API)/model/types/user-info/SberUserInfoEntity";
import { SberUserInfoBadRequestResponse } from "../../../model/types/user-info/responses/SberUserInfoBadRequestResponse";
import { SberUserInfoUnauthorizedResponse } from "../../../model/types/user-info/responses/SberUserInfoUnauthorizedResponse";
import { SberUserInfoNotAcceptableResponse } from "../../../model/types/user-info/responses/SberUserInfoNotAcceptableResponse";
import { SberUserInfoForbiddenResponse } from "../../../model/types/user-info/responses/SberUserInfoForbiddenResponse";
import { SberUserInfoTooManyRequestsResponse } from "../../../model/types/user-info/responses/SberUserInfoTooManyRequestsResponse";
import { SberUserInfoInternalServerErrorResponse } from "../../../model/types/user-info/responses/SberUserInfoInternalServerErrorResponse";

export async function getUserInfo(accessToken: string) {
    // Получение информации о клиенте
    try {
        // Адрес стенда
        const standUrl = `https://iftfintech.testsbi.sberbank.ru:9443/ic/sso/api/v2/oauth/user-info`;

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
                        (await response.json()) as SberUserInfoBadRequestResponse;
                    return ResponseData.BadRequest([
                        `${response.status}: ${responseData.error}. ${responseData.error_description}`,
                    ]);

                case 401:
                    responseData =
                        (await response.json()) as SberUserInfoUnauthorizedResponse;
                    return ResponseData.NotAuthorized([
                        `${response.status}: ${responseData.error}. ${responseData.error_description}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as SberUserInfoForbiddenResponse;
                    return ResponseData.Forbidden([
                        `${response.status}: ${responseData.errorCode}. ${responseData.errorMsg}`,
                    ]);

                case 406:
                    responseData =
                        (await response.json()) as SberUserInfoNotAcceptableResponse;
                    return ResponseData.NotAcceptable([
                        `${response.status}: ${responseData.error}. ${responseData.error_description}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as SberUserInfoTooManyRequestsResponse;
                    return ResponseData.TooManyRequests([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as SberUserInfoInternalServerErrorResponse;
                    return ResponseData.Error([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                default:
                    return ResponseData.Error(await response.text());
            }
        } else {
            const userInfo = await response.text();

            if (!userInfo) {
                return ResponseData.Error([
                    "Информация о пользователе отсутствует",
                ]);
            }

            const parts = userInfo.split(".");

            if (parts.length !== 3) {
                return ResponseData.Error([
                    "Информация о пользователе получена в неизвестном формате",
                ]);
            }

            const header = Buffer.from(parts[0], "base64url").toString("utf-8");
            const payload = Buffer.from(parts[1], "base64url").toString(
                "utf-8",
            );
            const sign = Buffer.from(parts[2], "base64url").toString("utf-8");

            return ResponseData.Ok<SberUserInfoEntity>(
                JSON.parse(payload) as SberUserInfoEntity,
            );
        }
    } catch (error) {
        return ResponseData.Error(error);
    }
}
