import { GlobalStateSchema } from "@/app/lib/store";
import { sberApiClientAdapter } from "../adapter/sberApiClientAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = sberApiClientAdapter.getInitialState();

export const getSberApiClientsSimpleList =
    sberApiClientAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.sberApiClientsSimpleListSchema ?? getInitialState,
    );

export const getSberApiClientsSimpleListIsLoading = (
    state: GlobalStateSchema,
) => {
    return state.sberApiClientsSimpleListSchema?.isLoading ?? false;
};

export const getSberApiClientsSimpleListError = (state: GlobalStateSchema) => {
    return state.sberApiClientsSimpleListSchema?.error ?? "";
};

export const getSberApiClientsSimpleListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.sberApiClientsSimpleListSchema?._isInitialized ?? false;
};
