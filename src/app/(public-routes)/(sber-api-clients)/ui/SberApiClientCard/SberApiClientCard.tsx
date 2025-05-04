"use client";

import React, { CSSProperties, memo, useMemo } from "react";
import { SberApiClientEntity } from "../../model/types/SberApiClientEntity";
import { App, Card, Flex, Skeleton, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { deleteSberApiClientByIdThunk } from "../../model/thunks/deleteSberApiClientByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { CheckSquareOutlined, DeleteOutlined } from "@ant-design/icons";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";
import { AuthCardButton } from "@/app/UI/AuthCardButton/ui/AuthCardButton";
import { PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

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
                    <Flex
                        style={{ width: "100%" }}
                        align={"center"}
                        justify={"start"}
                        gap={8}
                    >
                        <Typography.Text
                            style={{ fontSize: 16, fontWeight: "bold" }}
                            type={"secondary"}
                        >
                            {"Логин"}
                        </Typography.Text>
                        <HighlightedText
                            style={{ fontSize: 16, fontWeight: "bold" }}
                            text={sberApiClient?.login ?? ""}
                        />
                        {isAuth ? (
                            <Tag color={PRIMARY_COLOR}>{"подключено"}</Tag>
                        ) : null}
                    </Flex>
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
                            router.push(
                                `${process.env.NEXT_PUBLIC_SBER_AUTH_CODE_BASE_URL}?scope=${sberApiClient?.scope}&response_type=code&client_id=${sberApiClient?.clientId}&redirect_uri=${process.env.NEXT_PUBLIC_PATH}/sber-api-clients&state=${sberApiClient?.id}`,
                            );
                        }}
                    />
                ) : (
                    <Flex align={"center"} justify={"center"} gap={8} vertical>
                        <CheckSquareOutlined style={{ color: PRIMARY_COLOR }} />
                        <Typography.Text
                            style={{ fontSize: 10, color: PRIMARY_COLOR }}
                            type={"secondary"}
                        >
                            {`ПОДКЛЮЧЕНО`}
                        </Typography.Text>
                    </Flex>
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
                    <Flex
                        style={{ width: "100%" }}
                        align={"center"}
                        justify={"start"}
                        gap={4}
                    >
                        <Typography.Text
                            style={{ fontSize: 16 }}
                            type={"secondary"}
                        >
                            {"Client ID"}
                        </Typography.Text>
                        <HighlightedText
                            style={{ fontSize: 16, fontWeight: "bold" }}
                            text={sberApiClient?.clientId ?? ""}
                        />
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <Flex
                        style={{ width: "100%" }}
                        align={"center"}
                        justify={"start"}
                        gap={4}
                    >
                        <Typography.Text
                            style={{ fontSize: 16 }}
                            type={"secondary"}
                        >
                            {"Client secret"}
                        </Typography.Text>
                        <HighlightedText
                            style={{ fontSize: 16, fontWeight: "bold" }}
                            text={sberApiClient?.clientSecret ?? ""}
                        />
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <Flex
                        style={{ width: "100%" }}
                        align={"start"}
                        justify={"center"}
                        vertical
                        gap={4}
                    >
                        <Typography.Text
                            style={{ fontSize: 16 }}
                            type={"secondary"}
                        >
                            {"Scope"}
                        </Typography.Text>
                        <HighlightedText
                            style={{ fontSize: 10, fontWeight: "bold" }}
                            text={sberApiClient?.scope ?? ""}
                            rowsCount={2}
                        />
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <Flex
                        style={{ width: "100%" }}
                        align={"start"}
                        justify={"center"}
                        vertical
                        gap={4}
                    >
                        <Typography.Text
                            style={{ fontSize: 16 }}
                            type={"secondary"}
                        >
                            {"Access token"}
                        </Typography.Text>
                        <HighlightedText
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                color:
                                    sberApiClient?.accessToken === undefined
                                        ? "black"
                                        : PRIMARY_COLOR,
                            }}
                            text={sberApiClient?.accessToken ?? "отсутствует"}
                        />
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <Flex
                        style={{ width: "100%" }}
                        align={"start"}
                        justify={"center"}
                        vertical
                        gap={4}
                    >
                        <Typography.Text
                            style={{ fontSize: 16 }}
                            type={"secondary"}
                        >
                            {"Refresh token"}
                        </Typography.Text>
                        <HighlightedText
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                color:
                                    sberApiClient?.refreshToken === undefined
                                        ? "black"
                                        : PRIMARY_COLOR,
                            }}
                            text={sberApiClient?.refreshToken ?? "отсутствует"}
                        />
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {!isLoading ? (
                    <Flex
                        style={{ width: "100%" }}
                        align={"start"}
                        justify={"center"}
                        vertical
                        gap={4}
                    >
                        <Typography.Text
                            style={{ fontSize: 16 }}
                            type={"secondary"}
                        >
                            {"ID token"}
                        </Typography.Text>
                        <HighlightedText
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                color:
                                    sberApiClient?.idToken === undefined
                                        ? "black"
                                        : PRIMARY_COLOR,
                            }}
                            text={sberApiClient?.idToken ?? "отсутствует"}
                            rowsCount={2}
                        />
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
            </Flex>
        </Card>
    );
});
