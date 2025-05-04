"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../../../../model/types/SberApiClientEntity";

export async function deleteSberApiClientById(
    id: string,
): Promise<ResponseData<SberApiClientEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.sberApiClient.delete({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Клиент с ID=${id} не была удален`,
            ]);
        }

        return ResponseData.Ok<SberApiClientEntity>(
            candidate as SberApiClientEntity,
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
