"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { RublePaymentEntity } from "../types/RublePaymentEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface UpdateRublePaymentStatusThunkProps {
    paymentId: string;
    newStatus: string;
}

export const updateRublePaymentStatusThunk = createAsyncThunk<
    ResponseData<RublePaymentEntity | undefined>,
    UpdateRublePaymentStatusThunkProps,
    ThunkConfig<string>
>("updateRublePaymentStatusThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/payments/${props.paymentId}/update-status`,
            {
                method: "POST",
                body: JSON.stringify({ newStatus: props.newStatus }),
            },
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
