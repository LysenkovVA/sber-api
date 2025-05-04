import { NextRequest } from "next/server";
import { getSberApiClientById } from "@/app/(public-routes)/(sber-api-clients)/api/sber-api-clients/[id]/actions/getSberApiClientById";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { SberApiClientEntity } from "@/app/(public-routes)/(sber-api-clients)";

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

    if (!client) {
        return ResponseData.Error(["Клиент не определен!"]).toNextResponse();
    }

    // Получение токенов доступа
    try {
        const redirectUrl = `${process.env.NEXT_PUBLIC_PATH}/sber-api-clients`;
        const fetchUrl = `https://iftfintech.testsbi.sberbank.ru:9443/ic/sso/api/v2/oauth/token?grant_type=authorization_code&client_id=${client.data?.clientId}&code=${code}&redirect_uri=${redirectUrl}&client_secret=${client.data?.clientSecret}`;
        const response = await fetch(fetchUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
        });
        if (!response.ok) {
            return ResponseData.Error(["Ошибка при получении токенов!"]);
        }

        const { access_token, refresh_token, id_token } = await response.json();

        const newData = { ...client.data };
        newData.accessToken = access_token;
        newData.refreshToken = refresh_token;
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
