import { NextRequest } from "next/server";
import { getUserInfo } from "@/app/(public-routes)/(SBER-API)/sber-api/user-info/actions/getUserInfo";

export async function POST(request: NextRequest) {
    const { accessToken } = await request.json();
    return (await getUserInfo(accessToken)).toNextResponse();
}
