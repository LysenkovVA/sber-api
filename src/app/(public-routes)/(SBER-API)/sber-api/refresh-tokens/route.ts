import { NextRequest } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { getTokens } from "@/app/(public-routes)/(SBER-API)/sber-api/refresh-tokens/actions/getTokens";

/**
 * Получение токенов
 * @param request
 * BODY
 * grantType (authorization_code, refresh_token)
 * clientId
 * clientSecret
 * redirectUrl
 * code (обязательно для grantType: authorization_code)
 * refreshToken (обязательно для grantType: refresh_token)
 *
 * @constructor
 */
export async function POST(request: NextRequest) {
    // BODY
    const {
        grantType,
        clientId,
        clientSecret,
        redirectUrl,
        code,
        refreshToken,
    } = await request.json();

    // Проверка, что все параметры заданы
    if (!grantType) {
        return ResponseData.BadRequest([
            "Параметр grantType не задан",
        ]).toNextResponse();
    }

    if (grantType !== "authorization_code" && grantType !== "refresh_token") {
        return ResponseData.BadRequest([
            "Параметр grantType содержит неверное значение",
        ]).toNextResponse();
    }

    if (!clientId) {
        return ResponseData.BadRequest([
            "Параметр clientId не задан",
        ]).toNextResponse();
    }

    if (!clientSecret) {
        return ResponseData.BadRequest([
            "Параметр clientSecret не задан",
        ]).toNextResponse();
    }

    if (!redirectUrl) {
        return ResponseData.BadRequest([
            "Параметр redirectUrl не задан",
        ]).toNextResponse();
    }

    if (grantType === "authorization_code" && !code) {
        return ResponseData.BadRequest([
            "Параметр code не задан",
        ]).toNextResponse();
    }

    if (grantType === "refresh_token" && !refreshToken) {
        return ResponseData.BadRequest([
            "Параметр refreshToken не задан",
        ]).toNextResponse();
    }

    // Получение токенов доступа
    try {
        // const redirectUrl = `${process.env.NEXT_PUBLIC_PATH}/sber-api-clients`;

        const response = await getTokens(
            grantType,
            clientId,
            clientSecret,
            redirectUrl,
            code,
            refreshToken,
        );

        return response.toNextResponse();

        // // Если токены не получены, значит произошла ошибка
        // if (!response.isOk) {
        //     // Возвращаем ее
        //     return response.toNextResponse();
        // }
        //
        // const newData = { ...client.data };
        // newData.accessToken = response.data?.access_token;
        // // Аксес токен в Сбере живет 60 минут
        // newData.accessTokenExpireDate = dayjs(DateTimeHelper.Now())
        //     .add(60, "minutes")
        //     .format();
        // newData.refreshToken = response.data?.refresh_token;
        // // Рефреш токен живет 180 дней
        // newData.refreshTokenExpireDate = dayjs(DateTimeHelper.Now())
        //     .add(180, "days")
        //     .format();
        // newData.expiresIn = response.data?.expires_in;
        // newData.idToken = response.data?.id_token;
        //
        // // Обновление клиента
        // const upsertedData = await prisma.sberApiClient.update({
        //     data: { ...newData },
        //     where: { id: newData.id ?? "" },
        // });
        //
        // return ResponseData.Ok<SberApiClientEntity>(
        //     upsertedData as SberApiClientEntity,
        // ).toNextResponse();
    } catch (error) {
        return ResponseData.Error(error).toNextResponse();
    }
}
