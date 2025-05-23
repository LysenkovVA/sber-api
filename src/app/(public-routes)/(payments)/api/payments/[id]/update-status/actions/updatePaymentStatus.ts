"use server";

import prisma from "@/database/client";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export async function updatePaymentStatus(
    id: string,
    newStatus: string,
): Promise<ResponseData<RublePaymentEntity | undefined>> {
    try {
        // Удаляем
        const candidate = await prisma.rublePayment.update({
            data: {
                bankStatus: newStatus,
            },
            where: { id },
        });

        if (!candidate) {
            return ResponseData.BadRequest([
                `Статус платежа с ID=${id} не был обновлен`,
            ]);
        }

        return ResponseData.Ok<RublePaymentEntity>(
            candidate as RublePaymentEntity,
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
}
