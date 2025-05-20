"use client";

import React, { memo, useState } from "react";
import { Flex, Form, Typography } from "antd";
import { ModalSaveCancelDelete } from "@/app/UI/ModalSaveCancelDelete";
import { RublePaymentForm } from "@/app/(public-routes)/(payments)/ui/RublePaymentForm/RublePaymentForm";
import { PayCircleOutlined } from "@ant-design/icons";
import useNotification from "antd/es/notification/useNotification";

export interface CreateRublePaymentButtonProps {
    sberApiClientId?: string;
}

export const CreateRublePaymentButton = memo(
    (props: CreateRublePaymentButtonProps) => {
        const { sberApiClientId } = props;
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [form] = Form.useForm();
        const [notificationApi, contextHolder] = useNotification();

        return (
            <>
                {contextHolder}
                <Flex
                    align={"center"}
                    justify={"center"}
                    vertical
                    gap={4}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PayCircleOutlined style={{ color: "blue" }} />
                    <Typography.Text
                        style={{ fontSize: 10, color: "blue" }}
                        type={"secondary"}
                    >
                        {`Создать платеж`}
                    </Typography.Text>
                </Flex>
                <ModalSaveCancelDelete
                    isOpen={isModalOpen}
                    iconSrc={""}
                    title={"Платеж"}
                    onOk={() => form.submit()}
                    onCancel={() => setIsModalOpen(false)}
                    onClose={() => setIsModalOpen(false)}
                >
                    <RublePaymentForm
                        form={form}
                        sberApiClientId={sberApiClientId}
                        onSubmitted={(data) => {
                            notificationApi.success({
                                message: "Платеж направлен в банк-клиент",
                            });
                            // alert("Платеж совершен!");
                            setIsModalOpen(false);
                        }}
                    />
                </ModalSaveCancelDelete>
            </>
        );
    },
);
