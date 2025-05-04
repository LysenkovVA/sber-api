"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSberApiClientById } from "./actions/getSberApiClientById";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../../../model/types/SberApiClientEntity";
import { deleteSberApiClientById } from "./actions/deleteSberApiClientById";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
) {
    const { id } = await props.params;
    return (await getSberApiClientById(id)).toNextResponse();
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<SberApiClientEntity | undefined>>> {
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    return (await deleteSberApiClientById(id)).toNextResponse();
}
