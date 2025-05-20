import { NextRequest } from "next/server";
import { getClientInfo } from "@/app/(public-routes)/(SBER-API)/sber-api/client-info/actions/getClientInfo";

export async function POST(request: NextRequest) {
    const { accessToken } = await request.json();
    return (await getClientInfo(accessToken)).toNextResponse();
}
