"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import prisma from "@/database/client";
import { SberApiClientEntity } from "../../../model/types/SberApiClientEntity";

export const getSberApiClients = async (
    skip?: number,
    take?: number,
): Promise<ResponseData<SberApiClientEntity[] | undefined>> => {
    try {
        const [entities, totalCount] = await prisma.$transaction([
            prisma.sberApiClient.findMany({
                skip,
                take,
                orderBy: [{ createdAt: "asc" }],
            }),
            prisma.sberApiClient.count(),
        ]);

        return ResponseData.Ok<SberApiClientEntity[]>(
            entities as SberApiClientEntity[],
            {
                take,
                skip,
                search: undefined,
                total: totalCount,
            },
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
};
