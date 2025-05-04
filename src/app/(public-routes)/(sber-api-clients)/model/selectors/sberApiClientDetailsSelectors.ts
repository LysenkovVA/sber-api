import { GlobalStateSchema } from "@/app/lib/store";

export const getSberApiClientDetailsData = (state: GlobalStateSchema) => {
    return state.sberApiClientDetailsSchema?.entityData ?? undefined;
};

export const getSberApiClientDetailsFormData = (state: GlobalStateSchema) => {
    return state.sberApiClientDetailsSchema?.entityFormData ?? undefined;
};

export const getSberApiClientDetailsIsFetching = (state: GlobalStateSchema) => {
    return state.sberApiClientDetailsSchema?.isFetching ?? false;
};

export const getSberApiClientDetailsIsSaving = (state: GlobalStateSchema) => {
    return state.sberApiClientDetailsSchema?.isSaving ?? false;
};

export const getSberApiClientDetailsError = (state: GlobalStateSchema) => {
    return state.sberApiClientDetailsSchema?.error ?? "";
};

export const getSberApiClientDetailsIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.sberApiClientDetailsSchema?._isInitialized ?? false;
};
