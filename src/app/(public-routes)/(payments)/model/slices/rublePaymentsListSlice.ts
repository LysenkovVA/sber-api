import { createSlice } from "@reduxjs/toolkit";
import { ListReduxSchema } from "@/app/lib/types/ListReduxSchema";
import { RublePaymentFilter } from "@/app/(public-routes)/(payments)/model/types/RublePaymentFilter";
import { getRublePaymentsListThunk } from "@/app/(public-routes)/(payments)/model/thunks/getRublePaymentsListThunk";
import { rublePaymentAdapter } from "@/app/(public-routes)/(payments)/model/adapter/rublePaymentAdapter";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";
import { upsertRublePaymentThunk } from "@/app/(public-routes)/(payments)/model/thunks/upsertRublePaymentThunk";
import { deleteRublePaymentByIdThunk } from "@/app/(public-routes)/(payments)/model/thunks/deleteRublePaymentByIdThunk";
import { updateRublePaymentStatusThunk } from "@/app/(public-routes)/(payments)/model/thunks/updateRublePaymentStatusThunk";

const initialState: ListReduxSchema<RublePaymentEntity, RublePaymentFilter> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    take: 9,
    skip: 0,
    search: "",
    filters: undefined,
    totalCount: 0,
    hasMore: true,
    _isInitialized: false,
};

export const rublePaymentsListSlice = createSlice({
    name: "rublePaymentsListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRublePaymentsListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    rublePaymentAdapter.removeAll(state);
                    state.skip = 0;
                    state.totalCount = 0;
                    state.hasMore = true;
                }

                state._isInitialized = true;
            })
            .addCase(getRublePaymentsListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    rublePaymentAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    rublePaymentAdapter.addMany(state, action.payload.data!);
                }

                state.totalCount = action.payload.pagination?.total ?? 0;
                state.hasMore = state.totalCount > state.skip + state.take;

                if (state.hasMore) {
                    state.skip = state.skip + state.take;
                } else {
                    state.skip = state.totalCount;
                }
            })
            .addCase(getRublePaymentsListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    rublePaymentAdapter.removeAll(state);
                    state.hasMore = false;
                    state.totalCount = 0;
                }
            })
            .addCase(upsertRublePaymentThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Добавляем порцию данных
                rublePaymentAdapter.addOne(state, action.payload.data!);

                state.totalCount = state.totalCount + 1;
            })
            .addCase(deleteRublePaymentByIdThunk.fulfilled, (state, action) => {
                rublePaymentAdapter.removeOne(state, action.meta.arg.id);
                state.totalCount = state.totalCount - 1;
            })
            .addCase(deleteRublePaymentByIdThunk.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(
                updateRublePaymentStatusThunk.fulfilled,
                (state, action) => {
                    rublePaymentAdapter.upsertOne(state, action.payload.data!);
                },
            )
            .addCase(
                updateRublePaymentStatusThunk.rejected,
                (state, action) => {
                    state.error = action.payload;
                },
            );
    },
});

export const {
    actions: rublePaymentsListActions,
    reducer: rublePaymentsListReducer,
} = rublePaymentsListSlice;
