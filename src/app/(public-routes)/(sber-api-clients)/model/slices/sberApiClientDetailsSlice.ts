"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SberApiClientEntity } from "../types/SberApiClientEntity";
import { getSberApiClientByIdThunk } from "../thunks/getSberApiClientByIdThunk";
import { upsertSberApiClientThunk } from "../thunks/upsertSberApiClientThunk";
import { DetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";

const initialState: DetailsReduxSchema<SberApiClientEntity> = {
    entityData: {
        id: "",
        login: "",
        clientId: "",
        clientSecret: "",
        scope: "",
    },
    entityFormData: {
        id: "",
        login: "",
        clientId: "",
        clientSecret: "",
        scope: "",
    },
    error: "",
    isFetching: false,
    isSaving: false,
    _isInitialized: false,
};

export const sberApiClientDetailsSlice = createSlice({
    name: "sberApiClientDetailsSlice",
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
                data: SberApiClientEntity;
            }>,
        ) => {
            state.entityFormData = action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получение по id
            .addCase(getSberApiClientByIdThunk.pending, (state) => {
                state.isFetching = true;
                state.isSaving = false;
                state.error = undefined;
                state.entityData = {
                    id: "",
                    login: "",
                    clientId: "",
                    clientSecret: "",
                    scope: "",
                };
                state.entityFormData = {
                    id: "",
                    login: "",
                    clientId: "",
                    clientSecret: "",
                    scope: "",
                };
                state._isInitialized = false;
            })
            .addCase(getSberApiClientByIdThunk.fulfilled, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = undefined;
                state.entityData = action.payload.data!;
                state.entityFormData = action.payload.data!;
                state._isInitialized = true;
            })
            .addCase(getSberApiClientByIdThunk.rejected, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = action.payload;
                state.entityData = {
                    id: "",
                    login: "",
                    clientId: "",
                    clientSecret: "",
                    scope: "",
                };
                state.entityFormData = {
                    id: "",
                    login: "",
                    clientId: "",
                    clientSecret: "",
                    scope: "",
                };
                state._isInitialized = true;
            })
            .addCase(upsertSberApiClientThunk.pending, (state) => {
                state.isFetching = false;
                state.isSaving = true;
                state.error = undefined;
            })
            .addCase(upsertSberApiClientThunk.fulfilled, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = undefined;
                state.entityData = action.payload.data!;
                state.entityFormData = action.payload.data!;
            })
            .addCase(upsertSberApiClientThunk.rejected, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = action.payload;
            });
    },
});

export const {
    actions: sberApiClientDetailsActions,
    reducer: sberApiClientDetailsReducer,
} = sberApiClientDetailsSlice;
