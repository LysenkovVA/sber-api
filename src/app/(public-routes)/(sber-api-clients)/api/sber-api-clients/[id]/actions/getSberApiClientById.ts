"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../../../../model/types/SberApiClientEntity";

export async function getSberApiClientById(
    id: string,
): Promise<ResponseData<SberApiClientEntity | undefined>> {
    try {
        if (!id) {
            return ResponseData.BadRequest([`ID клиента не найден`]);
        }

        const candidate = await prisma.sberApiClient.findFirst({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([`Клиент с ID=${id} не найден`]);
        }

        return ResponseData.Ok<SberApiClientEntity>(
            candidate as SberApiClientEntity,
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
