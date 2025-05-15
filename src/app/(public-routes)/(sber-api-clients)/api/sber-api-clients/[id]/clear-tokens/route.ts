"use server";

import { NextRequest } from "next/server";
import { clearTokens } from "@/app/(public-routes)/(sber-api-clients)/api/sber-api-clients/[id]/clear-tokens/actions/clearTokens";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
) {
    const { id } = await props.params;
    return (await clearTokens(id)).toNextResponse();
}
