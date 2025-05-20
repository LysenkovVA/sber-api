"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { SberUserInfo } from "@/app/(public-routes)/(SBER-API)/sber-api/user-info/actions/getUserInfo";
import { getSberApiClientByIdThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/getSberApiClientByIdThunk";
import { sberApiRefreshTokensThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/sberApiRefreshTokensThunk";

export interface GetUserInfoThunkProps {
    sberApiClientId: string; // Идентификатор клиента в БД
}

export const getUserInfoThunk = createAsyncThunk<
    ResponseData<SberUserInfo | undefined>,
    GetUserInfoThunkProps,
    ThunkConfig<string>
>("getUserInfoThunk", async (props, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;

    try {
        const MAX_ATTEMPTS = 5;
        let CURRENT_ATTEMPT = 1;

        do {
            const client = await dispatch(
                getSberApiClientByIdThunk({ id: props.sberApiClientId }),
            ).unwrap();

            if (!client.isOk) {
                return rejectWithValue(ResponseData.getAllErrors(client));
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SBER_API_PATH}/user-info`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        accessToken: client.data?.accessToken,
                    }),
                },
            );

            const userInfo = (await response.json()) as ResponseData<
                SberUserInfo | undefined
            >;

            // Если произошла ошибки
            if (!userInfo.isOk) {
                // Если статус ошибки отличен от 401
                if (userInfo.status !== 401) {
                    // Бросаем ошибку дальше
                    return rejectWithValue(ResponseData.getAllErrors(userInfo));
                }
                // Если статус ошибки - неверный токен доступа
                else {
                    // Обновляем токены
                    await dispatch(
                        sberApiRefreshTokensThunk({
                            sberApiClientId: client.data!.id!,
                            grantType: "refresh_token",
                        }),
                    );
                    // Увеличиваем номер попытки
                    CURRENT_ATTEMPT += 1;
                    // Новая итерация цикла
                    continue;
                }
            }

            return userInfo;
        } while (CURRENT_ATTEMPT < MAX_ATTEMPTS);

        return rejectWithValue("Не удалось получить информацию о пользователе");
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
