import { NextRequest } from "next/server";
import { getSberApiClientById } from "@/app/(public-routes)/(sber-api-clients)/api/sber-api-clients/[id]/actions/getSberApiClientById";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { SberApiClientEntity } from "@/app/(public-routes)/(sber-api-clients)";
import fetch from "node-fetch";
import { getSberAgent } from "@/app/lib/sber/sberAgent";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string; code: string }> },
) {
    const { id, code } = await props.params;

    if (!id || !code) {
        return ResponseData.Error([
            "ID или код не определен!",
        ]).toNextResponse();
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
        // Параметры для "Content-Type": "application/x-www-form-urlencoded"
        const formData = new URLSearchParams();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", client.data.clientId!);
        formData.append("redirect_uri", redirectUrl);
        formData.append("code", code);
        formData.append("client_secret", client.data.clientSecret!);

        const response = await fetch(url, {
            agent: await getSberAgent(),
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: formData,
        });
        if (!response.ok) {
            return ResponseData.Error(["Ошибка при получении токенов!"]);
        }

        const {
            access_token,
            token_type,
            expires_in,
            refresh_token,
            scope,
            id_token,
        } = (await response.json()) as {
            access_token: string;
            token_type: string;
            expires_in: number;
            refresh_token: string;
            scope: string;
            id_token: string;
        };

        const newData = { ...client.data };
        newData.accessToken = access_token;
        newData.refreshToken = refresh_token;
        newData.expiresIn = expires_in;
        newData.idToken = id_token;

        // Обновление клиента
        const upsertedData = await prisma.sberApiClient.update({
            data: { ...newData },
            where: { id: newData.id ?? "" },
        });

        return ResponseData.Ok<SberApiClientEntity>(
            upsertedData,
        ).toNextResponse();
    } catch (error) {
        return ResponseData.Error(error).toNextResponse();
    }
}
