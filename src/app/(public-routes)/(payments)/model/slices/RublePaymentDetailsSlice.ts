"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { v4 as uuid } from "uuid";
import { getClientInfoThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/getClientInfoThunk";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";
import { upsertRublePaymentThunk } from "@/app/(public-routes)/(payments)/model/thunks/upsertRublePaymentThunk";

const initialState: DetailsReduxSchema<RublePaymentEntity> = {
    entityData: {
        id: "",
        amount: 0,
        date: new Date(),
        externalId: uuid(),
        operationCode: "01",
        priority: "5",
        voCode: "",
        purpose: "",
        payerName: "",
        payerInn: "",
        payerKpp: "",
        payerAccount: "",
        payerBankBic: "",
        payerBankCorrAccount: "",
        payeeName: "",
        payeeInn: "",
        payeeKpp: "",
        payeeAccount: "",
        payeeBankBic: "",
        payeeBankCorrAccount: "",
        vatType: "NO_VAT",
        vatRate: null,
        vatAmount: 0,
    },
    entityFormData: {
        id: "",
        amount: 0,
        date: new Date(),
        externalId: uuid(),
        operationCode: "01",
        priority: "5",
        voCode: "",
        purpose: "",
        payerName: "",
        payerInn: "",
        payerKpp: "",
        payerAccount: "",
        payerBankBic: "",
        payerBankCorrAccount: "",
        payeeName: "",
        payeeInn: "",
        payeeKpp: "",
        payeeAccount: "",
        payeeBankBic: "",
        payeeBankCorrAccount: "",
        vatType: "NO_VAT",
        vatRate: null,
        vatAmount: 0,
    },
    error: "",
    isFetching: false,
    isSaving: false,
    _isInitialized: false,
};

export const rublePaymentDetailsSlice = createSlice({
    name: "rublePaymentDetailsSlice",
    initialState,
    reducers: {
        setInitialized: (
            state,
            action: PayloadAction<{ isInitialized: boolean }>,
        ) => {
            state._isInitialized = action.payload.isInitialized;
        },
        setFormData: (
            state,
            action: PayloadAction<{
                data: RublePaymentEntity;
            }>,
        ) => {
            state.entityFormData = action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClientInfoThunk.fulfilled, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = undefined;
                // alert(JSON.stringify(action.payload.data, null, 2));
                state.entityData = {
                    ...state.entityData!,
                    payerName: action.payload.data?.fullName ?? "",
                    payerInn: action.payload.data?.inn ?? "",
                    payerKpp: action.payload.data?.kpps?.[0] ?? "",
                    payerAccount:
                        action.payload.data?.accounts?.[0]?.number ?? "",
                    payerBankBic: action.payload.data?.accounts?.[0]?.bic ?? "",
                };
                state.entityFormData = {
                    ...state.entityFormData!,
                    payerName: action.payload.data?.fullName ?? "",
                    payerInn: action.payload.data?.inn ?? "",
                    payerKpp: action.payload.data?.kpps?.[0] ?? "",
                    payerAccount:
                        action.payload.data?.accounts?.[0]?.number ?? "",
                    payerBankBic: action.payload.data?.accounts?.[0]?.bic ?? "",
                };
                state._isInitialized = true;
            })
            .addCase(upsertRublePaymentThunk.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getClientInfoThunk.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const {
    actions: rublePaymentDetailsActions,
    reducer: rublePaymentDetailsReducer,
} = rublePaymentDetailsSlice;
