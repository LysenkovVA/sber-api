"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { getSberApiClientById } from "../../actions/getSberApiClientById";
import { SberApiClientEntity } from "../../../../../model/types/SberApiClientEntity";

export async function clearTokens(
    id: string,
): Promise<ResponseData<SberApiClientEntity | undefined>> {
    try {
        const candidate = await getSberApiClientById(id);

        if (!candidate || !candidate.isOk) {
            return ResponseData.BadRequest([`Клиент с ID=${id} не найден`]);
        }

        const upsertedData = await prisma.sberApiClient.update({
            data: {
                ...candidate.data,
                accessToken: null,
                accessTokenExpireDate: null,
                refreshToken: null,
                refreshTokenExpireDate: null,
                idToken: null,
                expiresIn: null,
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: candidate.data?.id ?? "" },
        });

        return ResponseData.Ok<SberApiClientEntity>(
            upsertedData as SberApiClientEntity,
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
