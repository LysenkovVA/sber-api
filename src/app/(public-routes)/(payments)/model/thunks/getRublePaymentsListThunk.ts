"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export interface GetRublePaymentsListThunkProps {
    replaceData?: boolean;
}

export const getRublePaymentsListThunk = createAsyncThunk<
    ResponseData<RublePaymentEntity[] | undefined>,
    GetRublePaymentsListThunkProps,
    ThunkConfig<string>
>("getRublePaymentsListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const take = state.rublePaymentsListSchema?.take;
        const skip = state.rublePaymentsListSchema?.skip;
        const search = state.rublePaymentsListSchema?.search;
        const filters = state.rublePaymentsListSchema?.filters;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        if (take === undefined) {
            return rejectWithValue(`Параметр take не определен`);
        }

        if (skip === undefined) {
            return rejectWithValue(`Параметр skip не определен`);
        }

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/payments?&skip=${skip}&take=${take}&search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            RublePaymentEntity[] | undefined
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
