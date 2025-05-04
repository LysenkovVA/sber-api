"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SberApiClientEntity } from "../types/SberApiClientEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSberApiClientsSimpleListThunkProps {
    replaceData?: boolean;
}

export const getSberApiClientsSimpleListThunk = createAsyncThunk<
    ResponseData<SberApiClientEntity[] | undefined>,
    GetSberApiClientsSimpleListThunkProps,
    ThunkConfig<string>
>("getSberApiClientsSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/sber-api-clients`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            SberApiClientEntity[] | undefined
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
