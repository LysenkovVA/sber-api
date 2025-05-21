"use server";

import fetch from "node-fetch";
import { getSberAgent } from "@/app/lib/sber/sberAgent";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberTokensEntity } from "../../../model/types/tokens/SberTokensEntity";
import { SberTokensBadRequestResponse } from "../../../model/types/tokens/responses/SberTokensBadRequestResponse";
import { SberTokensForbiddenResponse } from "../../../model/types/tokens/responses/SberTokensForbiddenResponse";
import { SberTokensInternalServerErrorResponse } from "../../../model/types/tokens/responses/SberTokensInternalServerErrorResponse";
import { SberTokensNotAcceptableResponse } from "../../../model/types/tokens/responses/SberTokensNotAcceptableResponse";
import { SberTokensTooManyRequestsResponse } from "../../../model/types/tokens/responses/SberTokensTooManyRequestsResponse";

/**
 * Функция получения токенов доступа по коду авторизации либо refresh-токену
 * https://developers.sber.ru/docs/ru/sber-api/specifications/oauth-token-post
 *
 * @param sberTokenGrantType Получение токенов по коду или обновление токенов
 * @param clientId Идентификатор клиента
 * @param code Код авторизации
 * @param refreshToken Токен обновления, полученный при последнем получении токенов доступа
 * @param clientSecret Секрет клиента
 * @param redirectUrl Адрес перенаправления запроса
 * @param codeVerifier // TODO Разобраться зачем это надо
 *
 */
export async function getTokens(
    sberTokenGrantType: string,
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
    code?: string,
    refreshToken?: string,
    codeVerifier?: string,
): Promise<ResponseData<SberTokensEntity | undefined>> {
    try {
        /**
         * Формируем запрос, согласно документации
         * https://developers.sber.ru/docs/ru/sber-api/specifications/oauth-token-post
         */
        // Адрес стенда
        const standURL = `https://iftfintech.testsbi.sberbank.ru:9443/ic/sso/api/v2/oauth/token`;

        // Параметры для "Content-Type": "application/x-www-form-urlencoded"
        const formData = new URLSearchParams();
        formData.append("grant_type", sberTokenGrantType);
        formData.append("client_id", clientId);
        formData.append("redirect_uri", redirectUrl);
        if (code && sberTokenGrantType === "authorization_code") {
            formData.append("code", code);
        }
        if (refreshToken && sberTokenGrantType === "refresh_token") {
            formData.append("refresh_token", refreshToken);
        }
        formData.append("client_secret", clientSecret);
        if (codeVerifier) {
            formData.append("code_verifier", codeVerifier);
        }

        const response = await fetch(standURL, {
            agent: await getSberAgent(),
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
                cache: "no-cache",
            },
            body: formData,
        });

        if (!response.ok) {
            let responseData = undefined;
            switch (response.status) {
                case 400:
                    responseData =
                        (await response.json()) as SberTokensBadRequestResponse;
                    return ResponseData.BadRequest([
                        `Ошибка: ${responseData.error}`,
                        `Описание: ${responseData.error_description}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as SberTokensForbiddenResponse;
                    return ResponseData.Forbidden([
                        `Код: ${responseData.errorCode}`,
                        `Описание: ${responseData.errorMsg}`,
                    ]);

                case 406:
                    responseData =
                        (await response.json()) as SberTokensNotAcceptableResponse;
                    return ResponseData.NotAcceptable([
                        `Ошибка: ${responseData.error}`,
                        `Описание: ${responseData.error_description}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as SberTokensTooManyRequestsResponse;
                    return ResponseData.NotAcceptable([
                        `Причина: ${responseData.cause}`,
                        `Reference id: ${responseData.referenceId}`,
                        `Ошибка: ${responseData.message}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as SberTokensInternalServerErrorResponse;
                    return ResponseData.Error([
                        `Причина: ${responseData.cause}`,
                        `Reference id: ${responseData.referenceId}`,
                        `Ошибка: ${responseData.message}`,
                    ]);

                default:
                    return ResponseData.Error([
                        "Ошибка при получении токенов!",
                    ]);
            }
        }

        const data: SberTokensEntity =
            (await response.json()) as SberTokensEntity;

        return ResponseData.Ok(data);
    } catch (error) {
        return ResponseData.Error(error);
    }
}
