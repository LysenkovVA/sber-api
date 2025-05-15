"use server";

import { NextRequest, NextResponse } from "next/server";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { createRublePayment } from "@/app/lib/sber/actions/createRublePayment";
import { RublePaymentEntity } from "@/app/lib/sber/types/RublePaymentSchema";
import dayjs from "dayjs";
import { getSberApiClientById } from "@/app/(public-routes)/(sber-api-clients)/api/sber-api-clients/[id]/actions/getSberApiClientById";
import { v4 as uuidv4 } from "uuid";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData<RublePaymentEntity | undefined>>> {
    const { id } = await props.params;

    if (!id) {
        return ResponseData.BadRequest(["ID не задан"]).toNextResponse();
    }

    const client = await getSberApiClientById(id);

    if (!client || !client.isOk) {
        return ResponseData.NotFound(["Клиент не найден!"]).toNextResponse();
    }

    if (!client.data?.accessToken) {
        return ResponseData.Forbidden([
            "Access-токен отсутствует",
        ]).toNextResponse();
    }

    // Банковские реквизиты расчетного счета ПАО «МТС» для оплаты расходов по изготовлению копий документов
    //
    // ИНН/КПП 7740000076/770901001
    //
    // Р/с 40702810000000000652
    // В ПАО «МТС-Банк», г. Москва
    // К/с 30101810600000000232 в ОПЕРУ ГУ
    // Банка России по г. Москве
    // БИК 044525232
    //
    // ОКПО: 52686811
    // ОКАТО: 45286580000
    // ОКТМО: 45381000000
    // ОКОГУ: 4210011
    // ОКФС: 34
    // ОКОПФ: 12247
    // ОКВЭД: 64.20.11
    // DUNS номер: 633196746

    const testData: RublePaymentEntity = {
        date: dayjs("2025-05-15").toDate(),
        externalId: uuidv4().toString(),
        amount: 15.05,
        operationCode: "01",
        priority: "5",
        voCode: "61150",
        purpose: "Тестовое РПП. НДС нет.",
        // Плательщик
        payerName: "ТЕСТ СБЕР API для СПИФА",
        payerInn: "5143942707",
        payerAccount: "40702810606710000072",
        payerBankBic: "048073601",
        payerKpp: "583501001",
        payerBankCorrAccount: "30101810300000000601",
        // Кому
        payeeName: "ПАО МТС",
        payeeInn: "7740000076",
        payeeKpp: "770901001",
        payeeAccount: "40702810000000000652",
        payeeBankBic: "044525232",
        payeeBankCorrAccount: "30101810600000000232",
        vat: {
            type: "NO_VAT",
            rate: "10",
            amount: 15.05,
        },
    };

    return (
        await createRublePayment(client.data.accessToken, testData)
    ).toNextResponse();
}
