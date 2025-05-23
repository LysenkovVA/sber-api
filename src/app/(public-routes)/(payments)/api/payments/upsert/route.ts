"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import {
    RublePaymentEntity,
    RublePaymentEntitySchema,
} from "../../../model/types/RublePaymentEntity";
import { validateObject } from "@/app/lib/validation/validateObject";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<RublePaymentEntity | undefined>>> {
    try {
        const formData = await request.formData(); // <-- Pending...

        // Получаем данные из формы
        // Идентификатор
        const sberApiClientId = formData.get("sber-api-client-id") as string;
        const entityId = formData.get("entity-id") as string;

        // Объект
        const dataString = formData.get("entity-data") as string;
        const entityToSave = JSON.parse(dataString);

        // Валидация данных
        const validatedData = await validateObject(
            RublePaymentEntitySchema,
            entityToSave,
        );
        // const validatedData = entityToSave;

        const upsertedData = await prisma.rublePayment.upsert({
            create: {
                ...validatedData,
                sberApiClient: { connect: { id: sberApiClientId } },
            },
            update: {
                ...validatedData,
                sberApiClient: { connect: { id: sberApiClientId } },
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
            include: {
                sberApiClient: true,
            },
        });

        return ResponseData.Ok(
            upsertedData as RublePaymentEntity,
        ).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
