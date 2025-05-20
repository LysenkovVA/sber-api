"use server";

import fetch from "node-fetch";
import { getSberAgent } from "@/app/lib/sber/sberAgent";
import { ResponseData } from "@/app/lib/responses/ResponseData";

/**
 * Ответ сервера (200) при получении токенов
 */
export interface SBER_TOKENS_RESPONSE {
    access_token: string; // Авторизационный токен доступа
    token_type: string; // Всегда возвращается Bearer
    expires_in: number; // Срок жизни токена в секундах. Срок жизни access_token составляет 60 минут.
    refresh_token: string; // Токен обновления. Токен обновления. Срок жизни refresh_token составляет 180 дней.
    scope: string; // Набор атрибутов (claim) и операций, которые будут доступны Платформе после авторизации клиента.
    id_token: string; // Закодированный в Base64URL набор атрибутов клиента, необходимых для идентификации пользователя. Атрибуты разделены символами «.», каждый необходимо декодировать отдельно
}

/**
 * Ответ сервера (400) при получении токенов
 */
interface SBER_TOKENS_BAD_REQUEST_RESPONSE {
    error: string;
    error_description: string;
}

/**
 * Ответ сервера (403) при получении токенов
 */
interface SBER_TOKENS_FORBIDDEN_RESPONSE {
    errorCode: string;
    errorMsg: string;
}

/**
 * Ответ сервера (406) при получении токенов
 */
interface SBER_TOKENS_NOT_ACCEPTABLE_RESPONSE {
    error: string;
    error_description: string;
}

/**
 * Ответ сервера (429) при получении токенов
 */
interface SBER_TOKENS_TOO_MANY_REQUESTS_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
}

/**
 * Ответ сервера (500) при получении токенов
 */
interface SBER_TOKENS_INTERNAL_SERVER_ERROR_RESPONSE {
    cause: string;
    referenceId: string;
    message: string;
}

// export enum SberTokenGrantType {
//     authorizationCode = "authorization_code",
//     refreshToken = "refresh_token",
// }

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
): Promise<ResponseData<SBER_TOKENS_RESPONSE | undefined>> {
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
                        (await response.json()) as SBER_TOKENS_BAD_REQUEST_RESPONSE;
                    return ResponseData.BadRequest([
                        `Ошибка: ${responseData.error}`,
                        `Описание: ${responseData.error_description}`,
                    ]);

                case 403:
                    responseData =
                        (await response.json()) as SBER_TOKENS_FORBIDDEN_RESPONSE;
                    return ResponseData.Forbidden([
                        `Код: ${responseData.errorCode}`,
                        `Описание: ${responseData.errorMsg}`,
                    ]);

                case 406:
                    responseData =
                        (await response.json()) as SBER_TOKENS_NOT_ACCEPTABLE_RESPONSE;
                    return ResponseData.NotAcceptable([
                        `Ошибка: ${responseData.error}`,
                        `Описание: ${responseData.error_description}`,
                    ]);

                case 429:
                    responseData =
                        (await response.json()) as SBER_TOKENS_TOO_MANY_REQUESTS_RESPONSE;
                    return ResponseData.NotAcceptable([
                        `Причина: ${responseData.cause}`,
                        `Reference id: ${responseData.referenceId}`,
                        `Ошибка: ${responseData.message}`,
                    ]);

                case 500:
                    responseData =
                        (await response.json()) as SBER_TOKENS_INTERNAL_SERVER_ERROR_RESPONSE;
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

        const data: SBER_TOKENS_RESPONSE =
            (await response.json()) as SBER_TOKENS_RESPONSE;

        return ResponseData.Ok(data);
    } catch (error) {
        return ResponseData.Error(error);
    }
}
