"use client";

import React, { memo } from "react";
import { App, Button, Card, Flex, Typography } from "antd";
import { useAppDispatch } from "@/app/lib/store";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import dayjs from "dayjs";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";
import { BankOutlined, DeleteOutlined } from "@ant-design/icons";
import { getSberRublePaymentStatusThunk } from "@/app/(public-routes)/(SBER-API)/model/thunks/payments/getSberRublePaymentStatusThunk";
import { updateRublePaymentStatusThunk } from "@/app/(public-routes)/(payments)/model/thunks/updateRublePaymentStatusThunk";
import { deleteRublePaymentByIdThunk } from "@/app/(public-routes)/(payments)/model/thunks/deleteRublePaymentByIdThunk";

export interface RublePaymentCardProps {
    rublePayment?: RublePaymentEntity;
    isLoading?: boolean;
}

export const RublePaymentCard = memo((props: RublePaymentCardProps) => {
    const { rublePayment, isLoading } = props;

    const dispatch = useAppDispatch();
    const {
        error: errorNotification,
        success: successNotification,
        info: infoNotification,
    } = App.useApp().notification;

    const { confirm } = App.useApp().modal;

    return (
        <Card
            style={{
                width: "100%",
            }}
            size={"small"}
            actions={[
                <Button
                    type={"link"}
                    key={"updateStatus"}
                    icon={<BankOutlined />}
                    onClick={async () => {
                        if (!rublePayment?.sberApiClient?.id) {
                            errorNotification({
                                message: "ID клиента не определен!",
                            });
                            return;
                        }
                        if (!rublePayment?.externalId) {
                            errorNotification({
                                message: "ExternalId не определен!",
                            });
                            return;
                        }

                        const status = await dispatch(
                            getSberRublePaymentStatusThunk({
                                sberApiClientId: rublePayment.sberApiClient.id,
                                externalId: rublePayment.externalId,
                            }),
                        ).unwrap();

                        if (status.isOk) {
                            if (
                                status.data?.bankStatus ===
                                rublePayment.bankStatus
                            ) {
                                infoNotification({
                                    message: "Статус не изменился",
                                });
                            } else {
                                if (status.data?.bankStatus) {
                                    await dispatch(
                                        updateRublePaymentStatusThunk({
                                            paymentId: rublePayment.id,
                                            newStatus: status.data.bankStatus,
                                        }),
                                    );

                                    successNotification({
                                        message: `Статус обновлен на ${status.data?.bankStatus}`,
                                    });
                                } else {
                                    errorNotification({
                                        message:
                                            "Не удалось прочитать статус для обновления в БД",
                                    });
                                }
                            }
                        }
                    }}
                >
                    {"Обновить статус"}
                </Button>,
                <DeleteCardButton
                    key={"delete"}
                    isLoading={isLoading}
                    onClick={async () => {
                        if (rublePayment?.id) {
                            confirm({
                                title: "Удаление",
                                icon: (
                                    <DeleteOutlined style={{ color: "red" }} />
                                ),
                                content: `Удалить платеж на сумму ${rublePayment?.amount}₽ ?`,
                                okText: "Да",
                                okType: "danger",
                                cancelText: "Нет",
                                async onOk() {
                                    await dispatch(
                                        deleteRublePaymentByIdThunk({
                                            id: rublePayment?.id,
                                        }),
                                    );
                                },
                            });
                        }
                    }}
                />,
            ]}
            title={`№ ${rublePayment?.number ?? "-"} от ${dayjs(rublePayment?.date).format("DD.MM.YYYY")}`}
        >
            <Flex align={"start"} justify={"center"} gap={8} vertical>
                <Typography.Text
                    style={{ fontSize: 30 }}
                >{`Сумма: ${rublePayment?.amount} ₽`}</Typography.Text>
                <Typography.Text
                    type={"secondary"}
                >{`Статус: ${rublePayment?.bankStatus}`}</Typography.Text>
                <Typography.Text
                    type={"warning"}
                >{`ExternalId: ${rublePayment?.externalId}`}</Typography.Text>
            </Flex>
        </Card>
    );
});
