"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";
import { SberApiClientEntity } from "../types/SberApiClientEntity";

export interface RefreshSberApiClientTokensThunkProps {
    entityId?: string;
}

export const refreshSberApiClientTokensThunk = createAsyncThunk<
    ResponseData<SberApiClientEntity | undefined>,
    RefreshSberApiClientTokensThunkProps,
    ThunkConfig<string>
>("refreshSberApiClientTokensThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/sber-api-clients/${props.entityId}/refresh-tokens`,
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
