"use client";

import { memo, useCallback, useEffect } from "react";
import {
    App,
    Button,
    Divider,
    Flex,
    Form,
    FormInstance,
    Typography,
} from "antd";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import { FormItemInput } from "@/app/UI/FormItemInput";
import {
    rublePaymentDetailsActions,
    rublePaymentDetailsReducer,
} from "@/app/(public-routes)/(payments)/model/slices/RublePaymentDetailsSlice";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    getRublePaymentDetailsError,
    getRublePaymentDetailsFormData,
    getRublePaymentDetailsIsInitialized,
} from "@/app/(public-routes)/(payments)/model/selectors/rublePaymentDetailsSelectors";
import { getClientInfoThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/getClientInfoThunk";
import { CopyOutlined } from "@ant-design/icons";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { upsertRublePaymentThunk } from "@/app/(public-routes)/(payments)/model/thunks/upsertRublePaymentThunk";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export interface RublePaymentFormProps {
    form: FormInstance;
    sberApiClientId?: string;
    initialData?: RublePaymentEntity;
    onSubmitted: (data: RublePaymentEntity) => void;
}

export const RublePaymentForm = memo((props: RublePaymentFormProps) => {
    const { form, initialData, onSubmitted, sberApiClientId } = props;

    const dispatch = useAppDispatch();
    const formData = useAppSelector(getRublePaymentDetailsFormData);
    const isInitialized = useAppSelector(getRublePaymentDetailsIsInitialized);
    const error = useAppSelector(getRublePaymentDetailsError);

    const { error: errorNotification } = App.useApp().notification;

    useInitialEffect(() => {
        if (sberApiClientId) {
            // Инициализируем в стейте данные о клиенте (в RublePaymentDetails)
            dispatch(getClientInfoThunk({ sberApiClientId }));
        }
    });

    useEffect(() => {
        // Когда данные проинициализированы, т.е. информация о клиенте получена
        if (isInitialized) {
            form.setFieldsValue(formData);
        }
    }, [form, formData, isInitialized]);

    useEffect(() => {
        if (error) {
            errorNotification({ message: error });
        }
    }, [error, errorNotification]);

    const onFinish = useCallback(async () => {
        dispatch(
            upsertRublePaymentThunk({
                sberApiClientId: sberApiClientId!,
                entityData: {
                    ...formData!,
                    amount: Number(formData?.amount),
                    // date: new Date(),
                    payerKpp: "583501001",
                    payerBankCorrAccount: "30101810300000000601",
                },
            }),
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const data = result.payload as ResponseData<
                    RublePaymentEntity | undefined
                >;
                onSubmitted(data.data!);
            }
        });
    }, [dispatch, formData, onSubmitted, sberApiClientId]);

    return (
        <DynamicModuleLoader
            reducers={{
                rublePaymentDetailsSchema: rublePaymentDetailsReducer,
            }}
            removeAfterUnmount={true}
        >
            {error ? (
                <Typography.Text type={"danger"}>{error}</Typography.Text>
            ) : (
                <Form
                    id={"rublePaymentForm"}
                    form={form}
                    {...formItemLayout}
                    // disabled={isFetching || isSaving}
                    onFinish={onFinish}
                    clearOnDestroy // Чтобы очищались данные формы
                    onValuesChange={(_, values) => {
                        dispatch(
                            rublePaymentDetailsActions.setFormData({
                                data: {
                                    ...formData,
                                    ...values,
                                },
                            }),
                        );
                    }}
                >
                    <Divider orientation={"left"}>
                        <Flex align={"center"} justify={"center"} gap={8}>
                            <Typography.Text>{"Получатель"}</Typography.Text>
                            <Button
                                type={"link"}
                                icon={<CopyOutlined />}
                                onClick={() => {
                                    dispatch(
                                        rublePaymentDetailsActions.setFormData({
                                            data: {
                                                ...formData!,
                                                payeeName: "ПАО МТС",
                                                payeeInn: "7740000076",
                                                payeeKpp: "770901001",
                                                payeeAccount:
                                                    "40702810000000000652",
                                                payeeBankBic: "044525232",
                                                payeeBankCorrAccount:
                                                    "30101810600000000232",
                                                amount: 100,
                                                operationCode: "01",
                                                priority: "5",
                                                voCode: "61150",
                                                purpose:
                                                    "Тестовое РПП. НДС нет.",
                                            },
                                        }),
                                    );
                                }}
                            />
                        </Flex>
                    </Divider>
                    <FormItemInput
                        imageSrc={""}
                        labelText={"Название"}
                        namePath={["payeeName"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        labelText={"ИНН"}
                        namePath={["payeeInn"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        labelText={"КПП"}
                        namePath={["payeeKpp"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        labelText={"Р/с"}
                        namePath={["payeeAccount"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        labelText={"БИК"}
                        namePath={["payeeBankBic"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        labelText={"К/с"}
                        namePath={["payeeBankCorrAccount"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        labelText={"Сумма"}
                        namePath={["amount"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <Divider orientation={"left"}>{"Плательщик"}</Divider>
                    <FormItemInput
                        disabled={true}
                        imageSrc={""}
                        labelText={"Название"}
                        namePath={["payerName"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        disabled={true}
                        imageSrc={""}
                        labelText={"ИНН"}
                        namePath={["payerInn"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        disabled={true}
                        imageSrc={""}
                        labelText={"БИК"}
                        namePath={["payerBankBic"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        disabled={true}
                        imageSrc={""}
                        labelText={"Р/с"}
                        namePath={["payerAccount"]}
                        isLoading={false}
                        placeholder={""}
                    />
                    <FormItemInput
                        disabled={true}
                        imageSrc={""}
                        labelText={"КПП"}
                        namePath={["payerKpp"]}
                        isLoading={false}
                        placeholder={""}
                    />
                </Form>
            )}
        </DynamicModuleLoader>
    );
});
