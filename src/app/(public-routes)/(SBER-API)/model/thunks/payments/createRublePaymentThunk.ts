"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { RublePaymentEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/RublePaymentEntity";
import { getSberApiClientByIdThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/getSberApiClientByIdThunk";
import { sberApiRefreshTokensThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/sberApiRefreshTokensThunk";

export interface CreateRublePaymentThunkProps {
    sberApiClientId: string; // Идентификатор клиента в БД
    paymentData: RublePaymentEntity;
}

export const createRublePaymentThunk = createAsyncThunk<
    ResponseData<RublePaymentEntity | undefined>,
    CreateRublePaymentThunkProps,
    ThunkConfig<string>
>("createRublePaymentThunk", async (props, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;

    try {
        const MAX_ATTEMPTS = 5;
        let CURRENT_ATTEMPT = 1;

        do {
            const client = await dispatch(
                getSberApiClientByIdThunk({ id: props.sberApiClientId }),
            ).unwrap();

            if (!client.isOk) {
                return rejectWithValue(client.getAllErrors());
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SBER_API_PATH}/payments/create-ruble-payment`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        accessToken: client.data?.accessToken,
                        paymentData: props.paymentData,
                    }),
                },
            );

            const rpp = (await response.json()) as ResponseData<
                RublePaymentEntity | undefined
            >;

            // Если произошла ошибки
            if (!rpp.isOk) {
                // Если статус ошибки отличен от 401
                if (rpp.status !== 401) {
                    // Бросаем ошибку дальше
                    return rejectWithValue(ResponseData.getAllErrors(rpp));
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

            return rpp;
        } while (CURRENT_ATTEMPT < MAX_ATTEMPTS);

        return rejectWithValue("Не удалось направить РПП в банк-клиент");
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
