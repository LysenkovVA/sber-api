"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export async function deletePaymentById(
    id: string,
): Promise<ResponseData<RublePaymentEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.rublePayment.delete({
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([`Платеж с ID=${id} не был удален`]);
        }

        return ResponseData.Ok<RublePaymentEntity>(
            candidate as RublePaymentEntity,
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
