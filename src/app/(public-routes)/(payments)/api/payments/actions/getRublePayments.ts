"use server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { Prisma } from "@prisma/client";
import prisma from "@/database/client";
import { RublePaymentFilter } from "@/app/(public-routes)/(payments)/model/types/RublePaymentFilter";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export const getRublePayments = async (
    skip?: number,
    take?: number,
    search?: string,
    filters?: OptionalRecord<RublePaymentFilter, string[]>,
): Promise<ResponseData<RublePaymentEntity[] | undefined>> => {
    try {
        // Поисковая строка
        const searchString: Prisma.RublePaymentWhereInput = {};

        if (search !== undefined && search !== "") {
            searchString.OR = [];
        }

        const whereInput: Prisma.RublePaymentWhereInput = {
            AND: {},
            ...searchString,
        };

        const [entities, totalCount] = await prisma.$transaction([
            prisma.rublePayment.findMany({
                skip,
                take,
                where: whereInput,
                orderBy: [{ createdAt: "asc" }],
                include: {
                    sberApiClient: true,
                },
            }),
            prisma.rublePayment.count({ where: whereInput }),
        ]);

        return ResponseData.Ok<RublePaymentEntity[]>(
            entities as RublePaymentEntity[],
            {
                take,
                skip,
                search,
                total: totalCount,
            },
        );
    } catch (error) {
        // Неизвестная ошибка в роуте
        return ResponseData.Error(error);
    }
};
