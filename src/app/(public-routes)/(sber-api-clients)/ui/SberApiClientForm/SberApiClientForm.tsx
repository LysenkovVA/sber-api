"use client";

import { memo, useCallback, useEffect } from "react";
import { Form, FormInstance, Spin } from "antd";

import {
    DynamicModuleLoader,
    GlobalStateSchema,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { getSberApiClientByIdThunk } from "../../model/thunks/getSberApiClientByIdThunk";
import { upsertSberApiClientThunk } from "../../model/thunks/upsertSberApiClientThunk";
import {
    getSberApiClientDetailsError,
    getSberApiClientDetailsFormData,
    getSberApiClientDetailsIsFetching,
    getSberApiClientDetailsIsInitialized,
    getSberApiClientDetailsIsSaving,
} from "../../model/selectors/sberApiClientDetailsSelectors";
import { SberApiClientEntity } from "../../model/types/SberApiClientEntity";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { FormItemInput } from "@/app/UI/FormItemInput";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    sberApiClientDetailsActions,
    sberApiClientDetailsReducer,
} from "@/app/(public-routes)/(sber-api-clients)/model/slices/sberApiClientDetailsSlice";
import { FormItemTextArea } from "@/app/UI/FormItemTextArea";

export interface SberApiClientFormProps {
    form: FormInstance;
    entityId?: string;
    initialData?: SberApiClientEntity;
    onSubmitted: (data: SberApiClientEntity) => void;
}

export const SberApiClientForm = memo((props: SberApiClientFormProps) => {
    const { form, entityId, onSubmitted, initialData } = props;

    const [notificationApi, notificationContext] = useNotification();

    const dispatch = useAppDispatch();

    const formData = useAppSelector((state: GlobalStateSchema) =>
        getSberApiClientDetailsFormData(state),
    );
    const error = useAppSelector((state: GlobalStateSchema) =>
        getSberApiClientDetailsError(state),
    );
    const isFetching = useAppSelector((state: GlobalStateSchema) =>
        getSberApiClientDetailsIsFetching(state),
    );
    const isSaving = useAppSelector((state: GlobalStateSchema) =>
        getSberApiClientDetailsIsSaving(state),
    );
    const isInitialized = useAppSelector((state: GlobalStateSchema) =>
        getSberApiClientDetailsIsInitialized(state),
    );

    useInitialEffect(
        () => {
            if (initialData) {
                dispatch(
                    sberApiClientDetailsActions.setFormData({
                        data: initialData,
                    }),
                );
            } else {
                if (entityId) {
                    dispatch(
                        getSberApiClientByIdThunk({
                            id: entityId,
                        }),
                    );
                }
            }

            dispatch(
                sberApiClientDetailsActions.setInitialized({
                    isInitialized: true,
                }),
            );
        },
        () => {},
    );

    // Загрузка данных формы
    useEffect(() => {
        if (isInitialized && !isFetching && !isSaving) {
            form?.setFieldsValue(formData);
        }
    }, [dispatch, form, formData, isInitialized, isFetching, isSaving]);

    // Ошибка
    useEffect(() => {
        if (!!error) {
            notificationApi.error({ message: error });
        }
    }, [error, notificationApi]);

    const onFinish = useCallback(async () => {
        dispatch(
            upsertSberApiClientThunk({
                entityId,
                entityData: formData!,
            }),
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const data = result.payload as ResponseData<
                    SberApiClientEntity | undefined
                >;
                onSubmitted(data.data!);
            }
        });
    }, [dispatch, entityId, formData, onSubmitted]);

    return (
        <DynamicModuleLoader
            reducers={{
                sberApiClientDetailsSchema: sberApiClientDetailsReducer,
            }}
        >
            {notificationContext}
            <Spin spinning={isSaving} tip={"Сохранение..."} size={"large"}>
                <Form
                    id={"specialityForm"}
                    form={form}
                    {...formItemLayout}
                    disabled={isFetching || isSaving}
                    onFinish={onFinish}
                    clearOnDestroy // Чтобы очищались данные формы
                    onValuesChange={(_, values) => {
                        dispatch(
                            sberApiClientDetailsActions.setFormData({
                                data: {
                                    ...formData,
                                    ...values,
                                },
                            }),
                        );
                    }}
                >
                    <FormItemInput
                        labelText={"Login"}
                        namePath={["login"]}
                        required={true}
                        requiredMessage={"Укажите login"}
                        placeholder={"Укажите login"}
                        isLoading={isFetching}
                    />
                    <FormItemInput
                        labelText={"ClientId"}
                        namePath={["clientId"]}
                        required={true}
                        requiredMessage={"Укажите ClientId"}
                        placeholder={"Укажите ClientId"}
                        isLoading={isFetching}
                    />
                    <FormItemInput
                        labelText={"ClientSecret"}
                        namePath={["clientSecret"]}
                        required={true}
                        requiredMessage={"Укажите ClientSecret"}
                        placeholder={"Укажите ClientSecret"}
                        isLoading={isFetching}
                    />
                    <FormItemTextArea
                        labelText={"Scope"}
                        namePath={["scope"]}
                        required={true}
                        requiredMessage={"Укажите scope"}
                        placeholder={"Укажите scope"}
                        isLoading={isFetching}
                    />
                </Form>
            </Spin>
        </DynamicModuleLoader>
    );
});
