"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../../model/types/SberApiClientEntity";
import { getSberApiClients } from "./actions/getSberApiClients";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<ResponseData<SberApiClientEntity[] | undefined>>> {
    const { searchParams } = new URL(request.url);

    const skip = searchParams.get("skip");
    const take = searchParams.get("take");

    return (
        await getSberApiClients(
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
        )
    ).toNextResponse();
}
