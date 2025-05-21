"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { RublePaymentEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/RublePaymentEntity";
import { v4 as uuid } from "uuid";
import { getClientInfoThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/getClientInfoThunk";

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
        vat: null,
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
        vat: null,
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
        builder.addCase(getClientInfoThunk.fulfilled, (state, action) => {
            state.isFetching = false;
            state.isSaving = false;
            state.error = undefined;
            // alert(JSON.stringify(action.payload.data, null, 2));
            state.entityData = {
                ...state.entityData!,
                payerName: action.payload.data?.fullName ?? "",
                payerInn: action.payload.data?.inn ?? "",
                payerKpp: action.payload.data?.kpps?.[0] ?? "",
                payerAccount: action.payload.data?.accounts?.[0]?.number ?? "",
                payerBankBic: action.payload.data?.accounts?.[0]?.bic ?? "",
            };
            state.entityFormData = {
                ...state.entityFormData!,
                payerName: action.payload.data?.fullName ?? "",
                payerInn: action.payload.data?.inn ?? "",
                payerKpp: action.payload.data?.kpps?.[0] ?? "",
                payerAccount: action.payload.data?.accounts?.[0]?.number ?? "",
                payerBankBic: action.payload.data?.accounts?.[0]?.bic ?? "",
            };
            state._isInitialized = true;
        });
    },
});

export const {
    actions: rublePaymentDetailsActions,
    reducer: rublePaymentDetailsReducer,
} = rublePaymentDetailsSlice;
