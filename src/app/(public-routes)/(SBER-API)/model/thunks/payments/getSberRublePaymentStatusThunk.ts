"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { getSberApiClientByIdThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/getSberApiClientByIdThunk";
import { sberApiRefreshTokensThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/sberApiRefreshTokensThunk";
import { SberRublePaymentStatusEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/SberRublePaymentStatusEntity";

export interface GetSberRublePaymentStatusThunkProps {
    sberApiClientId: string; // Идентификатор клиента в БД
    externalId: string;
}

export const getSberRublePaymentStatusThunk = createAsyncThunk<
    ResponseData<SberRublePaymentStatusEntity | undefined>,
    GetSberRublePaymentStatusThunkProps,
    ThunkConfig<string>
>("getSberRublePaymentStatus", async (props, thunkApi) => {
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
                `${process.env.NEXT_PUBLIC_SBER_API_PATH}/payments/ruble-payment-state`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        accessToken: client.data?.accessToken,
                        externalId: props.externalId,
                    }),
                },
            );

            const status = (await response.json()) as ResponseData<
                SberRublePaymentStatusEntity | undefined
            >;

            // Если произошла ошибки
            if (!status.isOk) {
                // Если статус ошибки отличен от 401
                if (status.status !== 401) {
                    // Бросаем ошибку дальше
                    return rejectWithValue(ResponseData.getAllErrors(status));
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

            return status;
        } while (CURRENT_ATTEMPT < MAX_ATTEMPTS);

        return rejectWithValue("Не удалось получить статус РПП");
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
