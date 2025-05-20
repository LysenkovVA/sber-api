"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { SberUserInfo } from "@/app/(public-routes)/(SBER-API)/sber-api/user-info/actions/getUserInfo";
import { getUserInfoThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/getUserInfoThunk";

const initialState: DetailsReduxSchema<SberUserInfo> = {
    entityData: {},
    entityFormData: {},
    error: "",
    isFetching: false,
    isSaving: false,
    _isInitialized: false,
};

export const userInfoDetailsSlice = createSlice({
    name: "userInfoDetailsSlice",
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
                data: SberUserInfo;
            }>,
        ) => {
            state.entityFormData = action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfoThunk.pending, (state) => {
                state.isFetching = true;
                state.isSaving = false;
                state.error = undefined;
                state.entityData = {};
                state.entityFormData = {};
                state._isInitialized = false;
            })
            .addCase(getUserInfoThunk.fulfilled, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = undefined;
                state.entityData = action.payload.data!;
                state.entityFormData = action.payload.data!;
                state._isInitialized = true;
            })
            .addCase(getUserInfoThunk.rejected, (state, action) => {
                state.isFetching = false;
                state.isSaving = false;
                state.error = action.payload;
                state.entityData = {};
                state.entityFormData = {};
                state._isInitialized = true;
            });
    },
});

export const {
    actions: userInfoDetailsActions,
    reducer: userInfoDetailsReducer,
} = userInfoDetailsSlice;
