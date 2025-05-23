import { rublePaymentAdapter } from "../adapter/rublePaymentAdapter";
import { GlobalStateSchema } from "@/app/lib/store";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = rublePaymentAdapter.getInitialState();

export const getRublePaymentsList =
    rublePaymentAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.rublePaymentsListSchema ?? getInitialState,
    );

export const getRublePaymentsListIsLoading = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.isLoading ?? false;
};

export const getRublePaymentsListError = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.error ?? "";
};

export const getRublePaymentsListIsInitialized = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?._isInitialized ?? false;
};

export const getRublePaymentsListTake = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.take ?? 10;
};

export const getRublePaymentsListSkip = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.skip ?? 0;
};

export const getRublePaymentsListSearch = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.search ?? "";
};

export const getRublePaymentsListTotalCount = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.totalCount ?? 0;
};

export const getRublePaymentsListHasMore = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.hasMore ?? true;
};

export const getRublePaymentsListFilters = (state: GlobalStateSchema) => {
    return state.rublePaymentsListSchema?.filters ?? undefined;
};
