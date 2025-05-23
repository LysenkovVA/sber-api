"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import {
    RublePaymentEntity,
    RublePaymentEntitySchema,
} from "../types/RublePaymentEntity";
import { createSberRublePaymentThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/payments/createSberRublePaymentThunk";
import { SberRublePaymentEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/SberRublePaymentEntity";
import { validateObject } from "@/app/lib/validation/validateObject";

export interface UpsertRublePaymentThunkProps {
    sberApiClientId: string;
    entityId?: string;
    entityData: RublePaymentEntity;
}

export const upsertRublePaymentThunk = createAsyncThunk<
    ResponseData<RublePaymentEntity | undefined>,
    UpsertRublePaymentThunkProps,
    ThunkConfig<string>
>("upsertRublePaymentThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState, dispatch } = thunkApi;

    try {
        const state = getState();

        // Отправляем платеж в банк
        const sberRublePaymentData = await dispatch(
            createSberRublePaymentThunk({
                sberApiClientId: props.sberApiClientId,
                paymentData: {
                    number: props.entityData.number,
                    date: props.entityData.date,
                    bankStatus: props.entityData.bankStatus,
                    bankComment: props.entityData.bankComment,
                    externalId: props.entityData.externalId,
                    amount: props.entityData.amount,
                    operationCode: props.entityData.operationCode,
                    deliveryKind: props.entityData.deliveryKind,
                    priority: props.entityData.priority,
                    urgencyCode: props.entityData.urgencyCode,
                    voCode: props.entityData.voCode,
                    purpose: props.entityData.purpose,
                    departmentalInfo: {
                        uip: props.entityData.departmentalInfoUip,
                        drawerStatus101:
                            props.entityData.departmentalInfoDrawerStatus101,
                        kbk: props.entityData.departmentalInfoKbk,
                        oktmo: props.entityData.departmentalInfoOktmo,
                        reasonCode106:
                            props.entityData.departmentalInfoReasonCode106,
                        taxPeriod107:
                            props.entityData.departmentalInfoTaxPeriod107,
                        docNumber108:
                            props.entityData.departmentalInfoDocNumber108,
                        docDate109: props.entityData.departmentalInfoDocDate109,
                    },
                    payerName: props.entityData.payerName,
                    payerInn: props.entityData.payerInn,
                    payerKpp: props.entityData.payerKpp,
                    payerAccount: props.entityData.payerAccount,
                    payerBankBic: props.entityData.payerBankBic,
                    payerBankCorrAccount: props.entityData.payerBankCorrAccount,
                    payeeName: props.entityData.payeeName,
                    payeeInn: props.entityData.payeeInn,
                    payeeKpp: props.entityData.payeeKpp,
                    payeeAccount: props.entityData.payeeAccount,
                    payeeBankBic: props.entityData.payeeBankBic,
                    payeeBankCorrAccount: props.entityData.payeeBankCorrAccount,
                    crucialFieldsHash: props.entityData.crucialFieldsHash,
                    vat: {
                        type: props.entityData.vatType,
                        rate: props.entityData.vatRate,
                        amount: props.entityData.vatAmount,
                    },
                    incomeTypeCode: props.entityData.incomeTypeCode,
                    isPaidByCredit: props.entityData.isPaidByCredit,
                    creditContractNumber: props.entityData.creditContractNumber,
                },
            }),
        ).unwrap();

        if (sberRublePaymentData.isOk) {
            const createdSberRublePayment =
                sberRublePaymentData.data as SberRublePaymentEntity;

            // Формируем запрос на добавление
            const formData = new FormData();

            if (props.sberApiClientId) {
                formData.append("sber-api-client-id", props.sberApiClientId);
            }

            // Идентификтор сущности
            if (props.entityId) {
                formData.append("entity-id", props.entityId);
            }

            const paymentData: RublePaymentEntity = {
                id: "",
                number: createdSberRublePayment.number,
                date: createdSberRublePayment.date,
                bankStatus: createdSberRublePayment.bankStatus,
                bankComment: createdSberRublePayment.bankComment ?? "",
                externalId: createdSberRublePayment.externalId,
                amount: createdSberRublePayment.amount
                    ? Number(createdSberRublePayment.amount)
                    : 0,
                operationCode: createdSberRublePayment.operationCode,
                deliveryKind: createdSberRublePayment.deliveryKind,
                priority: createdSberRublePayment.priority,
                urgencyCode: createdSberRublePayment.urgencyCode ?? "",
                voCode: createdSberRublePayment.voCode,
                purpose: createdSberRublePayment.purpose,
                departmentalInfoUip:
                    createdSberRublePayment.departmentalInfo?.uip,
                departmentalInfoDrawerStatus101:
                    createdSberRublePayment.departmentalInfo?.drawerStatus101,
                departmentalInfoKbk:
                    createdSberRublePayment.departmentalInfo?.kbk,
                departmentalInfoOktmo:
                    createdSberRublePayment.departmentalInfo?.oktmo,
                departmentalInfoReasonCode106:
                    createdSberRublePayment.departmentalInfo?.reasonCode106,
                departmentalInfoTaxPeriod107:
                    createdSberRublePayment.departmentalInfo?.taxPeriod107,
                departmentalInfoDocNumber108:
                    createdSberRublePayment.departmentalInfo?.docNumber108,
                departmentalInfoDocDate109:
                    createdSberRublePayment.departmentalInfo?.docDate109,
                payerName: createdSberRublePayment.payerName,
                payerInn: createdSberRublePayment.payerInn,
                payerKpp: createdSberRublePayment.payerKpp,
                payerAccount: createdSberRublePayment.payerAccount,
                payerBankBic: createdSberRublePayment.payerBankBic,
                payerBankCorrAccount:
                    createdSberRublePayment.payerBankCorrAccount,
                payeeName: createdSberRublePayment.payeeName,
                payeeInn: createdSberRublePayment.payeeInn,
                payeeKpp: createdSberRublePayment.payeeKpp,
                payeeAccount: createdSberRublePayment.payeeAccount,
                payeeBankBic: createdSberRublePayment.payeeBankBic,
                payeeBankCorrAccount:
                    createdSberRublePayment.payeeBankCorrAccount,
                crucialFieldsHash: createdSberRublePayment.crucialFieldsHash,
                vatType: createdSberRublePayment.vat?.type ?? "NO_VAT",
                vatRate: createdSberRublePayment.vat?.rate ?? "0",
                vatAmount: createdSberRublePayment.vat?.amount
                    ? Number(createdSberRublePayment.vat?.amount)
                    : 0,
                incomeTypeCode: createdSberRublePayment.incomeTypeCode ?? "",
                isPaidByCredit: createdSberRublePayment.isPaidByCredit,
                creditContractNumber:
                    createdSberRublePayment.creditContractNumber,
            };

            const validatedPaymentData = await validateObject(
                RublePaymentEntitySchema,
                paymentData,
            );

            // Данные сущности
            formData.append(
                "entity-data",
                // Конвертируем в наш платеж для добавления в БД
                JSON.stringify({
                    ...validatedPaymentData,
                }),
            );

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_PATH}/payments/upsert`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        encoding: `multipart/form-data`,
                    },
                },
            );

            const createdEntity = (await response.json()) as ResponseData<
                RublePaymentEntity | undefined
            >;

            if (!createdEntity.isOk) {
                return rejectWithValue(
                    ResponseData.getAllErrors(createdEntity),
                );
            }

            return createdEntity;
        } else {
            return rejectWithValue(
                ResponseData.getAllErrors(sberRublePaymentData),
            );
        }
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
