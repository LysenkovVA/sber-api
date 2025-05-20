"use server";

import { getSberAgent } from "@/app/lib/sber/sberAgent";
import fetch from "node-fetch";
import { ResponseData } from "@/app/lib/responses/ResponseData";

/**
 * https://developers.sber.ru/docs/ru/sber-api/specifications/client-info/get-client-info
 */
export interface SberClientInfo {
    shortName?: string;
    fullName?: string;
    resident?: boolean;
    ogrn?: string;
    inn?: string;
    okpo?: string;
    okato?: string;
    orgForm?: string;
    territorialBank?: string;
    orgPprbId?: number;
    orgRegDateINN?: string;
    orgRegDateOGRN?: string;
    nonClient?: boolean;
    orgUnconfirmed?: boolean;
    eksEpkId?: number;
    isCorpCardHolder?: boolean;
    hasActiveCreditLine?: boolean;
    creditLineAvailableSum?: string; // TODO конвертация из number
    branch?: {
        name?: string;
        address?: string;
        code?: string;
    };
    orgKindActivityInfo?: {
        code?: number;
        name?: string;
    };
    addresses?: [
        {
            type?: string;
            country?: string;
            zip?: string;
            region?: string;
            area?: string;
            city?: string;
            settlementType?: string;
            settlement?: string;
            street?: string;
            house?: string;
            building?: string;
            flat?: string;
            fullAddress?: string;
        },
    ];
    accounts?: [
        {
            number?: string;
            name?: string;
            currencyCode?: string;
            bic?: string;
            type?:
                | "assuranceRegistration"
                | "calculated"
                | "transit"
                | "specialTransit"
                | "budget"
                | "loan"
                | "deposit";
            openDate?: Date;
            closeDate?: Date;
            state?: "OPEN" | "BLOCKED" | "RESERVED" | "CLOSED";
            dbo?: boolean;
            business?: boolean;
            minBalance?: string; // TODO конвертация из number
            cdiPermDocQnt?: number;
            cdiPermDocSum?: string; // TODO конвертация из number
            cdiAcptDocQnt?: number;
            cdiAcptDocSum?: string; // TODO конвертация из number
            cdiCart2DocQnt?: number;
            cdiCart2DocSum?: string; // TODO конвертация из number
            debitBlocked?: boolean;
            debitBlockedCause?: string;
            debitBlockedBeginDate?: Date;
            debitBlockedEndDate?: Date;
            creditBlocked?: boolean;
            creditBlockedCause?: string;
            creditBlockedBeginDate?: Date;
            creditBlockedEndDate?: Date;
            blockedSums?: [
                {
                    sum?: string; // TODO конвертация из number
                    cause?: string;
                    blockedQueues?: number;
                    beginDate?: Date;
                    endDate?: Date;
                },
            ];
            blockedQueuesInfo?: [
                {
                    sum?: string; // TODO конвертация из number
                    cause?: string;
                    blockedQueues?: number;
                    beginDate?: Date;
                    endDate?: Date;
                },
            ];
            blockedSumQueuesInfo?: [
                {
                    sum?: string; // TODO конвертация из number
                    cause?: string;
                    blockedQueues?: number;
                    beginDate?: Date;
                    endDate?: Date;
                },
            ];
        },
    ];
    kpps?: string[];
    dboContracts?: [
        {
            number?: string;
            date?: Date;
        },
    ];
}

interface SBER_CLIENT_INFO_BAD_REQUEST_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

interface SBER_CLIENT_INFO_UNAUTHORIZED_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

interface SBER_CLIENT_INFO_FORBIDDEN_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

interface SBER_CLIENT_INFO_NOT_FOUND_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

interface SBER_CLIENT_INFO_TOO_MANY_REQUESTS_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

interface SBER_CLIENT_INFO_INTERNAL_SERVER_ERROR_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

interface SBER_CLIENT_INFO_INTERNAL_SERVER_ERROR_503_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}

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
                        (await response.json()) as SBER_CLIENT_INFO_BAD_REQUEST_RESPONSE;
                    return ResponseData.BadRequest([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 401:
                    responseData =
                        (await response.json()) as SBER_CLIENT_INFO_UNAUTHORIZED_RESPONSE;
                    return ResponseData.NotAuthorized([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as SBER_CLIENT_INFO_FORBIDDEN_RESPONSE;
                    return ResponseData.Forbidden([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 404:
                    responseData =
                        (await response.json()) as SBER_CLIENT_INFO_NOT_FOUND_RESPONSE;
                    return ResponseData.NotAcceptable([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as SBER_CLIENT_INFO_TOO_MANY_REQUESTS_RESPONSE;
                    return ResponseData.TooManyRequests([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as SBER_CLIENT_INFO_INTERNAL_SERVER_ERROR_RESPONSE;
                    return ResponseData.Error([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                case 503:
                    responseData =
                        (await response.json()) as SBER_CLIENT_INFO_INTERNAL_SERVER_ERROR_503_RESPONSE;
                    return ResponseData.Error([
                        `${response.status}: ${responseData.cause}. ${responseData.message}. ReferenceId: ${responseData.referenceId}`,
                    ]);

                default:
                    return ResponseData.Error(await response.json());
            }
        } else {
            const clientInfo: SberClientInfo =
                (await response.json()) as SberClientInfo;

            if (!clientInfo) {
                return ResponseData.Error(["Информация о клиенте отсутствует"]);
            }

            return ResponseData.Ok<SberClientInfo>(clientInfo);
        }
    } catch (error) {
        return ResponseData.Error(error);
    }
}
