"use client";

import { memo } from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { EditablePageWrapper } from "@/app/UI/EditablePageWrapper";
import { DynamicModuleLoader } from "@/app/lib/store";
import { SberApiClientForm } from "../SberApiClientForm/SberApiClientForm";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { sberApiClientDetailsReducer } from "@/app/(public-routes)/(sber-api-clients)/model/slices/sberApiClientDetailsSlice";

export interface EditSberApiClientWidgetProps {
    sberApiClientId?: string;
}

export const EditSberApiClientWidget = memo(
    (props: EditSberApiClientWidgetProps) => {
        const { sberApiClientId } = props;

        const [form] = Form.useForm();
        const router = useRouter();

        return (
            <DynamicModuleLoader
                reducers={{
                    sberApiClientDetailsSchema: sberApiClientDetailsReducer,
                }}
            >
                <EditablePageWrapper
                    title={sberApiClientId ? "Изменение" : "Новый клиент"}
                    // additionalTitle={
                    //     SberApiClientHelper.getSurnameWithInitials(formData) ?? undefined
                    // }
                    height={CONTENT_HEIGHT}
                    onSave={() => form.submit()}
                    onCancel={() => router.back()}
                >
                    <SberApiClientForm
                        form={form}
                        onSubmitted={() => router.back()}
                        entityId={sberApiClientId}
                    />
                </EditablePageWrapper>
            </DynamicModuleLoader>
        );
    },
);
