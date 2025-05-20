import { GlobalStateSchema } from "@/app/lib/store";

export const getRublePaymentDetailsFormData = (state: GlobalStateSchema) => {
    return state.rublePaymentDetailsSchema?.entityFormData ?? undefined;
};

export const getRublePaymentDetailsError = (state: GlobalStateSchema) => {
    return state.rublePaymentDetailsSchema?.error ?? undefined;
};

export const getRublePaymentDetailsIsLoading = (state: GlobalStateSchema) => {
    return state.rublePaymentDetailsSchema?.isFetching ?? false;
};

export const getRublePaymentDetailsIsSaving = (state: GlobalStateSchema) => {
    return state.rublePaymentDetailsSchema?.isSaving ?? false;
};

export const getRublePaymentDetailsIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.rublePaymentDetailsSchema?._isInitialized ?? false;
};
