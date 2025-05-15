"use client";

import React, { CSSProperties, memo, useMemo } from "react";
import { SberApiClientEntity } from "../../model/types/SberApiClientEntity";
import { App, Card, Flex, Skeleton, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { deleteSberApiClientByIdThunk } from "../../model/thunks/deleteSberApiClientByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import {
    ClearOutlined,
    CoffeeOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";
import { AuthCardButton } from "@/app/UI/AuthCardButton/ui/AuthCardButton";
import { ERROR_COLOR, PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";
import dayjs from "dayjs";
import { ClearTokensButton } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientCard/ClearTokensButton";
import { clearTokensThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/clearTokensThunk";
import { DateTimeHelper } from "@/app/lib/utils/dateTimeHelper";
import { RefreshTokensButton } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientCard/RefreshTokensButton";
import { refreshSberApiClientTokensThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/refreshSberApiClientTokensThunk";
import { CreateRublePaymentButton } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientCard/CreateRublePaymentButton";
import { createRublePaymentThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/createRublePaymentThunk";

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
                ) : undefined,
                // ) : (
                //     <Flex
                //         align={"center"}
                //         justify={"center"}
                //         gap={8}
                //         vertical
                //         onClick={() => {
                //             if (sberApiClient?.id) {
                //                 router.push(
                //                     `/sber-api-clients/${sberApiClient?.id}`,
                //                 );
                //             }
                //         }}
                //     >
                //         <CheckSquareOutlined style={{ color: PRIMARY_COLOR }} />
                //         <Typography.Text
                //             style={{ fontSize: 10, color: PRIMARY_COLOR }}
                //             type={"secondary"}
                //         >
                //             {`Выбрать`}
                //         </Typography.Text>
                //     </Flex>
                // ),
                <ClearTokensButton
                    key={"clearTokens"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (sberApiClient?.id) {
                            confirm({
                                title: "Очистка токенов",
                                icon: (
                                    <ClearOutlined style={{ color: "blue" }} />
                                ),
                                content: `Очистить токены?`,
                                okText: "Да",
                                okType: "danger",
                                cancelText: "Нет",
                                onOk() {
                                    dispatch(
                                        clearTokensThunk({
                                            id: sberApiClient.id,
                                        }),
                                    );
                                },
                            });
                        }
                    }}
                />,
                <RefreshTokensButton
                    key={"refreshTokens"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (sberApiClient?.id) {
                            confirm({
                                title: "Обновление токенов",
                                icon: (
                                    <CoffeeOutlined style={{ color: "blue" }} />
                                ),
                                content: `Обновить токены доступа?`,
                                okText: "Да",
                                okType: "danger",
                                cancelText: "Нет",
                                onOk() {
                                    dispatch(
                                        refreshSberApiClientTokensThunk({
                                            entityId: sberApiClient.id,
                                        }),
                                    );
                                },
                            });
                        }
                    }}
                />,
                <CreateRublePaymentButton
                    key={"createRublePayment"}
                    isLoading={isLoading}
                    onClick={async () => {
                        if (sberApiClient?.id) {
                            try {
                                const result = await dispatch(
                                    createRublePaymentThunk({
                                        entityId: sberApiClient.id,
                                    }),
                                ).unwrap();

                                if (result.isOk) {
                                    alert("Платеж выполнен!");
                                } else {
                                    alert(result.getAllErrors());
                                }
                            } catch (error) {
                                // alert("Ошибка при выполнении запроса!");
                            }
                        }
                    }}
                />,
                <EditCardButton
                    key={"edit"}
                    isLoading={isLoading}
                    onClick={() => {
                        if (sberApiClient?.id) {
                            router.push(
                                `/sber-api-clients/${sberApiClient?.id}/edit`,
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
                        <Flex align={"center"} justify={"center"} gap={8}>
                            <Typography.Text
                                style={{ fontSize: 16 }}
                                type={"secondary"}
                            >
                                {"Access token"}
                            </Typography.Text>
                            {sberApiClient?.accessTokenExpireDate ? (
                                <Tag
                                    color={
                                        dayjs(DateTimeHelper.Now()).isBefore(
                                            dayjs(
                                                sberApiClient?.accessTokenExpireDate,
                                            ).format(),
                                        )
                                            ? "green"
                                            : "red"
                                    }
                                >
                                    {dayjs(DateTimeHelper.Now()).isBefore(
                                        dayjs(
                                            sberApiClient?.accessTokenExpireDate,
                                        ).format(),
                                    )
                                        ? `Действует до ${dayjs(
                                              sberApiClient?.accessTokenExpireDate,
                                          ).format("DD.MM.YYYY HH:mm:ss")}`
                                        : `Истек ${dayjs(
                                              sberApiClient?.accessTokenExpireDate,
                                          ).format()}`}
                                </Tag>
                            ) : null}
                        </Flex>
                        <HighlightedText
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                color: !sberApiClient?.accessToken
                                    ? ERROR_COLOR
                                    : dayjs(DateTimeHelper.Now()).isBefore(
                                            dayjs(
                                                sberApiClient?.accessTokenExpireDate,
                                            ).format(),
                                        )
                                      ? PRIMARY_COLOR
                                      : ERROR_COLOR,
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
                        <Flex align={"center"} justify={"center"} gap={8}>
                            <Typography.Text
                                style={{ fontSize: 16 }}
                                type={"secondary"}
                            >
                                {"Refresh token"}
                            </Typography.Text>
                            {sberApiClient?.refreshTokenExpireDate ? (
                                <Tag
                                    color={
                                        dayjs(DateTimeHelper.Now()).isBefore(
                                            dayjs(
                                                sberApiClient?.refreshTokenExpireDate,
                                            ).format(),
                                        )
                                            ? "green"
                                            : "red"
                                    }
                                >
                                    {dayjs(DateTimeHelper.Now()).isBefore(
                                        dayjs(
                                            sberApiClient?.refreshTokenExpireDate,
                                        ).format(),
                                    )
                                        ? `Действует до ${dayjs(
                                              sberApiClient?.refreshTokenExpireDate,
                                          ).format("DD.MM.YYYY HH:mm:ss")}`
                                        : `Истек ${dayjs(
                                              sberApiClient?.refreshTokenExpireDate,
                                          ).format()}`}
                                </Tag>
                            ) : null}
                        </Flex>
                        <HighlightedText
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                color: !sberApiClient?.refreshToken
                                    ? ERROR_COLOR
                                    : dayjs(DateTimeHelper.Now()).isBefore(
                                            dayjs(
                                                sberApiClient?.refreshTokenExpireDate,
                                            ).format(),
                                        )
                                      ? PRIMARY_COLOR
                                      : ERROR_COLOR,
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
                                color: !sberApiClient?.idToken
                                    ? ERROR_COLOR
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
