"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../types/SberApiClientEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSberApiClientByIdThunkProps {
    id: string;
}

export const getSberApiClientByIdThunk = createAsyncThunk<
    ResponseData<SberApiClientEntity | undefined>,
    GetSberApiClientByIdThunkProps,
    ThunkConfig<string>
>("getSberApiClientByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/sber-api-clients/${props.id}`,
            { method: "GET" },
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
