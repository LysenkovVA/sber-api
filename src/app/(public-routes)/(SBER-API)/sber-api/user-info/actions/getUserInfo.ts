"use server";

import { getSberAgent } from "@/app/lib/sber/sberAgent";
import fetch from "node-fetch";
import { ResponseData } from "@/app/lib/responses/ResponseData";

export interface SberUserInfo {
    sub?: string;
    orgKpp?: string;
    iss?: string;
    inn?: string;
    orgJuridicalAddress?: string;
    OrgName?: string;
    orgFullName?: string;
    buyOnCreditMmb?: boolean;
    individualExecutiveAgency?: number;
    terBank?: string;
    userCryptoType?: string;
    aud?: string;
    summOfferSmartCredit?: number;
    orgLawFormShort?: string;
    orgOgrn?: string;
    orgActualAddress?: string;
    HashOrgId?: string;
    offerSmartCredit?: boolean;
    name?: string;
    userPosition?: string;
    hasActiveCreditLine?: boolean;
    phone_number?: string;
    orgLawForm?: string;
    email?: string;
}

interface SBER_USER_INFO_BAD_REQUEST_RESPONSE {
    error: string;
    error_description: string;
}

interface SBER_USER_INFO_UNAUTHORIZED_RESPONSE {
    error: string;
    error_description: string;
}

interface SBER_USER_INFO_FORBIDDEN_RESPONSE {
    errorCode: string;
    errorMsg: string;
}

interface SBER_USER_INFO_NOT_ACCEPTABLE_RESPONSE {
    error: string;
    error_description: string;
}

interface SBER_USER_INFO_TOO_MANY_REQUESTS_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
}

interface SBER_USER_INFO_INTERNAL_SERVER_ERROR_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
}

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
                        (await response.json()) as SBER_USER_INFO_BAD_REQUEST_RESPONSE;
                    return ResponseData.BadRequest([
                        `${response.status}: ${responseData.error}. ${responseData.error_description}`,
                    ]);

                case 401:
                    responseData =
                        (await response.json()) as SBER_USER_INFO_UNAUTHORIZED_RESPONSE;
                    return ResponseData.NotAuthorized([
                        `${response.status}: ${responseData.error}. ${responseData.error_description}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as SBER_USER_INFO_FORBIDDEN_RESPONSE;
                    return ResponseData.Forbidden([
                        `${response.status}: ${responseData.errorCode}. ${responseData.errorMsg}`,
                    ]);

                case 406:
                    responseData =
                        (await response.json()) as SBER_USER_INFO_NOT_ACCEPTABLE_RESPONSE;
                    return ResponseData.NotAcceptable([
                        `${response.status}: ${responseData.error}. ${responseData.error_description}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as SBER_USER_INFO_TOO_MANY_REQUESTS_RESPONSE;
                    return ResponseData.TooManyRequests([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as SBER_USER_INFO_INTERNAL_SERVER_ERROR_RESPONSE;
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

            return ResponseData.Ok<SberUserInfo>(
                JSON.parse(payload) as SberUserInfo,
            );
        }
    } catch (error) {
        return ResponseData.Error(error);
    }
}
