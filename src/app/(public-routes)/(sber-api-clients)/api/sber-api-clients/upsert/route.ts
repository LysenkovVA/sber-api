"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { validateObject } from "@/app/lib/validation/validateObject";
import {
    SberApiClientEntity,
    SberApiClientEntitySchema,
} from "../../../model/types/SberApiClientEntity";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SberApiClientEntity | undefined>>> {
    try {
        const formData = await request.formData();
        // Получаем данные из формы
        // Идентификатор
        const entityId = formData.get("entity-id") as string;

        // Объект
        const dataString = formData.get("entity-data") as string;
        const entityToSave = JSON.parse(dataString);

        // Валидация данных
        const validatedData = await validateObject(
            SberApiClientEntitySchema,
            entityToSave,
        );

        // const validatedData = SberApiClientEntitySchema.parse(entityToSave)

        const upsertedData = await prisma.sberApiClient.upsert({
            create: {
                ...validatedData,
            },
            update: {
                ...validatedData,
            },
            // Если entityId null, тогда будет создана новая запись
            // В этом месте необходимо задать значение по умолчанию, чтобы prisma
            // не выдавала ошибку
            where: { id: entityId ?? "" },
        });

        return ResponseData.Ok(
            upsertedData as SberApiClientEntity,
        ).toNextResponse();
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error).toNextResponse();
    }
}
