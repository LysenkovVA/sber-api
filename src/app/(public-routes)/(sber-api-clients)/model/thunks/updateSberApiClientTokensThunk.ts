"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";
import { SberApiClientEntity } from "../types/SberApiClientEntity";

export interface UpdateSberApiClientTokensThunkProps {
    entityId?: string;
    code?: string;
}

export const updateSberApiClientTokensThunk = createAsyncThunk<
    ResponseData<SberApiClientEntity | undefined>,
    UpdateSberApiClientTokensThunkProps,
    ThunkConfig<string>
>("upsertSberApiClientThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/sber-api-clients/${props.entityId}/${props.code}`,
            {
                method: "POST",
            },
        );

        const createdEntity = (await response.json()) as ResponseData<
            SberApiClientEntity | undefined
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
