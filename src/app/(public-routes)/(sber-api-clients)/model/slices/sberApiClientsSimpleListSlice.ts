import { createSlice } from "@reduxjs/toolkit";
import { getSberApiClientsSimpleListThunk } from "../thunks/getSberApiClientsSimpleListThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { SberApiClientEntity } from "../types/SberApiClientEntity";
import { sberApiClientAdapter } from "../adapter/sberApiClientAdapter";
import { updateSberApiClientTokensThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/updateSberApiClientTokensThunk";

const initialState: SimpleListReduxSchema<SberApiClientEntity> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    _isInitialized: false,
};

export const sberApiClientsSimpleListSlice = createSlice({
    name: "sberApiClientsSimpleListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getSberApiClientsSimpleListThunk.pending,
                (state, action) => {
                    state.isLoading = true;
                    state.error = undefined;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Очищаем старые
                        sberApiClientAdapter.removeAll(state);
                    }

                    state._isInitialized = true;
                },
            )
            .addCase(
                getSberApiClientsSimpleListThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = undefined;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Записываем новые данные
                        sberApiClientAdapter.setAll(
                            state,
                            action.payload.data!,
                        );
                    } else {
                        // Добавляем порцию данных
                        sberApiClientAdapter.addMany(
                            state,
                            action.payload.data!,
                        );
                    }
                },
            )
            .addCase(
                getSberApiClientsSimpleListThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Очищаем старые
                        sberApiClientAdapter.removeAll(state);
                    }
                },
            )
            .addCase(
                updateSberApiClientTokensThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = undefined;

                    sberApiClientAdapter.upsertOne(state, action.payload.data!);
                },
            )
            .addCase(
                updateSberApiClientTokensThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                },
            );
    },
});

export const {
    actions: sberApiClientsSimpleListActions,
    reducer: sberApiClientsSimpleListReducer,
} = sberApiClientsSimpleListSlice;
