"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";
import { RublePaymentEntity } from "@/app/lib/sber/types/RublePaymentSchema";

export interface CreateRublePaymentThunkProps {
    entityId?: string;
}

export const createRublePaymentThunk = createAsyncThunk<
    ResponseData<RublePaymentEntity | undefined>,
    CreateRublePaymentThunkProps,
    ThunkConfig<string>
>("createRublePaymentThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/sber-api-clients/${props.entityId}/create-ruble-payment`,
            {
                method: "POST",
            },
        );

        const createdEntity = (await response.json()) as ResponseData<
            RublePaymentEntity | undefined
        >;

        if (!createdEntity.isOk) {
            return rejectWithValue(ResponseData.getAllErrors(createdEntity));
        }

        return createdEntity;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
