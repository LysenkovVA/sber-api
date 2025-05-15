import { NextRequest } from "next/server";
import { getSberApiClientById } from "@/app/(public-routes)/(sber-api-clients)/api/sber-api-clients/[id]/actions/getSberApiClientById";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { SberApiClientEntity } from "@/app/(public-routes)/(sber-api-clients)";
import dayjs from "dayjs";
import { DateTimeHelper } from "@/app/lib/utils/dateTimeHelper";
import { getTokens } from "@/app/lib/sber/actions/getTokens";
import { SberTokenGrantType } from "@/app/lib/sber/types/SberTokenGrantType";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
) {
    const { id } = await props.params;

    if (!id) {
        return ResponseData.Error(["ID не определен!"]).toNextResponse();
    }

    const client = await getSberApiClientById(id);

    if (!client || !client.data) {
        return ResponseData.Error(["Клиент не определен!"]).toNextResponse();
    }

    // Получение токенов доступа
    try {
        const redirectUrl = `${process.env.NEXT_PUBLIC_PATH}/sber-api-clients`;

        /**
         * Формируем запрос, согласно документации
         * https://developers.sber.ru/docs/ru/sber-api/specifications/oauth-token-post
         */
        // Адрес стенда
        const url = `https://iftfintech.testsbi.sberbank.ru:9443/ic/sso/api/v2/oauth/token`;

        const response = await getTokens(
            SberTokenGrantType.refreshToken,
            client.data.clientId!,
            client.data.clientSecret!,
            redirectUrl,
            url,
            undefined,
            client.data.refreshToken!,
        );

        // Если токены не получены, значит произошла ошибка
        if (!response.isOk) {
            // Возвращаем ее
            return response.toNextResponse();
        }

        const newData = { ...client.data };
        newData.accessToken = response.data?.access_token;
        // Аксес токен в Сбере живет 60 минут
        newData.accessTokenExpireDate = dayjs(DateTimeHelper.Now())
            .add(60, "minutes")
            .format();
        newData.refreshToken = response.data?.refresh_token;
        // Рефреш токен живет 180 дней
        newData.refreshTokenExpireDate = dayjs(DateTimeHelper.Now())
            .add(180, "days")
            .format();
        newData.expiresIn = response.data?.expires_in;
        newData.idToken = response.data?.id_token;

        // Обновление клиента
        const upsertedData = await prisma.sberApiClient.update({
            data: { ...newData },
            where: { id: newData.id ?? "" },
        });

        return ResponseData.Ok<SberApiClientEntity>(
            upsertedData as SberApiClientEntity,
        ).toNextResponse();
    } catch (error) {
        return ResponseData.Error(error).toNextResponse();
    }
}
