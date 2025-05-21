"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { getSberApiClientByIdThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/getSberApiClientByIdThunk";
import { DateTimeHelper } from "@/app/lib/utils/dateTimeHelper";
import dayjs from "dayjs";
import { upsertSberApiClientThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/upsertSberApiClientThunk";
import { SberTokensEntity } from "@/app/(public-routes)/(SBER-API)/model/types/tokens/SberTokensEntity";

export interface SberApiRefreshTokensThunkProps {
    sberApiClientId: string; // Идентификатор клиента в БД
    grantType: "authorization_code" | "refresh_token";
    code?: string;
}

export const sberApiRefreshTokensThunk = createAsyncThunk<
    ResponseData<SberTokensEntity | undefined>,
    SberApiRefreshTokensThunkProps,
    ThunkConfig<string>
>("sberApiRefreshTokensThunk", async (props, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;

    try {
        const client = await dispatch(
            getSberApiClientByIdThunk({ id: props.sberApiClientId }),
        ).unwrap();

        if (!client.isOk) {
            return rejectWithValue(client.getAllErrors());
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SBER_API_PATH}/refresh-tokens`,
            {
                method: "POST",
                body: JSON.stringify({
                    grantType: props.grantType,
                    clientId: client.data?.clientId,
                    clientSecret: client.data?.clientSecret,
                    redirectUrl: process.env.NEXT_PUBLIC_SBER_API_REDIRECT_URL,
                    code: props.code,
                    refreshToken: client.data?.refreshToken,
                }),
            },
        );

        const newTokens = (await response.json()) as ResponseData<
            SberTokensEntity | undefined
        >;

        if (!newTokens.isOk) {
            console.log("sberApiRefreshTokensThunk newTokens not OK");
            return rejectWithValue(newTokens.getAllErrors());
        } else {
            console.log("sberApiRefreshTokensThunk newTokens OK");
            // Обновляем токены для клиента
            const newClientData = { ...client.data };
            newClientData.accessToken = newTokens.data?.access_token;
            // Аксес токен в Сбере живет 60 минут
            newClientData.accessTokenExpireDate = dayjs(DateTimeHelper.Now())
                .add(60, "minutes")
                .format();
            newClientData.refreshToken = newTokens.data?.refresh_token;
            // Рефреш токен живет 180 дней
            newClientData.refreshTokenExpireDate = dayjs(DateTimeHelper.Now())
                .add(180, "days")
                .format();
            newClientData.expiresIn = newTokens.data?.expires_in;
            newClientData.idToken = newTokens.data?.id_token;

            await dispatch(
                upsertSberApiClientThunk({
                    entityId: client.data?.id,
                    // @ts-ignore // TODO fix!
                    entityData: { ...newClientData },
                }),
            );
        }

        return newTokens;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
