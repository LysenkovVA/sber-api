"use client";

import React, { CSSProperties, memo, useMemo } from "react";
import { SberApiClientEntity } from "../../model/types/SberApiClientEntity";
import { App, Card, Flex, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { deleteSberApiClientByIdThunk } from "../../model/thunks/deleteSberApiClientByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";
import { AuthCardButton } from "@/app/UI/AuthCardButton/ui/AuthCardButton";

export interface SberApiClientCardProps {
    style?: CSSProperties;
    sberApiClient?: SberApiClientEntity;
    isLoading?: boolean;
}

export const SberApiClientCard = memo((props: SberApiClientCardProps) => {
    const { style, sberApiClient, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { confirm } = App.useApp().modal;

    const isAuth = useMemo(() => {
        if (
            sberApiClient?.accessToken &&
            sberApiClient?.refreshToken &&
            sberApiClient?.idToken
        ) {
            return true;
        }
        return false;
    }, [
        sberApiClient?.accessToken,
        sberApiClient?.idToken,
        sberApiClient?.refreshToken,
    ]);

    return (
        <Card
            style={{
                borderWidth: 1,
                width: "100%",
                ...style,
            }}
            title={
                !isLoading ? (
                    <HighlightedText
                        style={{ fontSize: 16, fontWeight: "bold" }}
                        text={sberApiClient?.login ?? ""}
                    />
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )
            }
            size={"small"}
            actions={[
                !isAuth ? (
                    <AuthCardButton
                        key={"auth"}
                        isLoading={isLoading}
                        onClick={() => {
                            // router.push(
                            //     `${process.env.NEXT_PUBLIC_SBER_AUTH_CODE_BASE_URL}?scope=${sberApiClient?.scope}&response_type=[code]&client_id=${sberApiClient?.clientId}&redirect_uri=${"http://localhost:3000/sber-api-clients"}&state=one1two2three3four4five5six6seven7eight8nine9ten10`,
                            // );
                            router.push(
                                `${process.env.NEXT_PUBLIC_SBER_AUTH_CODE_BASE_URL}?scope=${sberApiClient?.scope}&response_type=code&client_id=${sberApiClient?.clientId}&redirect_uri=${"http://localhost:3000/sber-api-clients"}&state=${sberApiClient?.id}`,
                            );
                        }}
                    />
                ) : (
                    <GiftOutlined key={"cool"} />
                ),
                <EditCardButton
                    key={"edit"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (sberApiClient?.id) {
                            router.push(
                                `/sber-api-clients/${sberApiClient?.id}`,
                            );
                        }
                    }}
                />,
                <DeleteCardButton
                    key={"delete"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (sberApiClient?.id) {
                            confirm({
                                title: "Удаление",
                                icon: (
                                    <DeleteOutlined style={{ color: "red" }} />
                                ),
                                content: `Удалить "${sberApiClient?.login}"?`,
                                okText: "Да",
                                okType: "danger",
                                cancelText: "Нет",
                                onOk() {
                                    dispatch(
                                        deleteSberApiClientByIdThunk({
                                            id: sberApiClient?.id,
                                        }),
                                    );
                                },
                            });
                        }
                    }}
                />,
            ]}
        >
            <Flex align={"start"} justify={"start"} gap={4} vertical>
                {!isLoading ? (
                    <HighlightedText
                        style={{ fontSize: 16 }}
                        text={sberApiClient?.clientId ?? ""}
                    />
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <HighlightedText
                        style={{ fontSize: 16 }}
                        text={sberApiClient?.clientSecret ?? ""}
                    />
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <HighlightedText
                        style={{ fontSize: 16 }}
                        text={sberApiClient?.scope ?? ""}
                    />
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
            </Flex>
        </Card>
    );
});
