"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { RublePaymentEntity } from "../types/RublePaymentEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface DeleteRublePaymentByIdThunkProps {
    id: string;
}

export const deleteRublePaymentByIdThunk = createAsyncThunk<
    ResponseData<RublePaymentEntity | undefined>,
    DeleteRublePaymentByIdThunkProps,
    ThunkConfig<string>
>("deleteRublePaymentByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/payments/${props.id}`,
            { method: "DELETE" },
        );

        const data = (await response.json()) as ResponseData<
            RublePaymentEntity | undefined
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
