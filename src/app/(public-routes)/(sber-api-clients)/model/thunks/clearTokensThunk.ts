"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../types/SberApiClientEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface clearTokensThunkProps {
    id: string;
}

export const clearTokensThunk = createAsyncThunk<
    ResponseData<SberApiClientEntity | undefined>,
    clearTokensThunkProps,
    ThunkConfig<string>
>("clearTokensThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    console.log("Clear Tokens Thunk");

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/sber-api-clients/${props.id}/clear-tokens`,
            { method: "POST" },
        );

        const data = (await response.json()) as ResponseData<
            SberApiClientEntity | undefined
        >;

        if (!data.isOk) {
            return rejectWithValue(ResponseData.getAllErrors(data));
        }

        return data;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
