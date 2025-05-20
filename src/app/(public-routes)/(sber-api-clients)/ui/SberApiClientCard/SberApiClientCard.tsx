"use client";

import React, { CSSProperties, memo, useMemo } from "react";
import { SberApiClientEntity } from "../../model/types/SberApiClientEntity";
import { App, Card, Flex, Skeleton, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { deleteSberApiClientByIdThunk } from "../../model/thunks/deleteSberApiClientByIdThunk";
import { useAppDispatch } from "@/app/lib/store";
import { EditCardButton } from "@/app/UI/EditCardButton";
import { DeleteCardButton } from "@/app/UI/DeleteCardButton";
import { DeleteOutlined, DisconnectOutlined } from "@ant-design/icons";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";
import { AuthCardButton } from "@/app/UI/AuthCardButton/ui/AuthCardButton";
import { ERROR_COLOR, PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";
import dayjs from "dayjs";
import { ClearTokensButton } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientCard/ClearTokensButton";
import { clearTokensThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/clearTokensThunk";
import { DateTimeHelper } from "@/app/lib/utils/dateTimeHelper";
import { CreateRublePaymentButton } from "@/app/(public-routes)/(payments)/ui/CreateRublePaymentButton";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";
import { v4 as uuidv4 } from "uuid";

export interface SberApiClientCardProps {
    style?: CSSProperties;
    sberApiClient?: SberApiClientEntity;
    isLoading?: boolean;
}

// TODO delete this!
const testData: RublePaymentEntity = {
    id: "",
    date: dayjs("2025-05-15").toDate(),
    externalId: uuidv4().toString(),
    amount: 15.05,
    operationCode: "01",
    priority: "5",
    voCode: "61150",
    purpose: "Тестовое РПП. НДС нет.",
    // Плательщик
    payerName: "ТЕСТ СБЕР API для СПИФА",
    payerInn: "5143942707",
    payerAccount: "40702810606710000072",
    payerBankBic: "048073601",
    payerKpp: "583501001",
    payerBankCorrAccount: "30101810300000000601",
    // Кому
    payeeName: "ПАО МТС",
    payeeInn: "7740000076",
    payeeKpp: "770901001",
    payeeAccount: "40702810000000000652",
    payeeBankBic: "044525232",
    payeeBankCorrAccount: "30101810600000000232",
    vat: {
        type: "NO_VAT",
        rate: "10",
        amount: 15.05,
    },
};

export const SberApiClientCard = memo((props: SberApiClientCardProps) => {
    const { style, sberApiClient, isLoading } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {
        success,
        error: notificationError,
        info: infoNotification,
    } = App.useApp().notification;
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
                        ) : (
                            <Tag color={ERROR_COLOR}>{"отключено"}</Tag>
                        )}
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
                    <ClearTokensButton
                        key={"clearTokens"}
                        isLoading={isLoading}
                        onClick={() => {
                            if (sberApiClient?.id) {
                                confirm({
                                    title: "Отключить",
                                    icon: (
                                        <DisconnectOutlined
                                            style={{ color: "red" }}
                                        />
                                    ),
                                    content: `Отключиться от банка?`,
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
                    />
                ),
                <CreateRublePaymentButton
                    key={"createRublePayment"}
                    sberApiClientId={sberApiClient?.id}
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
                {/*{!isLoading ? (*/}
                {/*    <Flex*/}
                {/*        style={{ width: "100%" }}*/}
                {/*        align={"center"}*/}
                {/*        justify={"start"}*/}
                {/*        gap={4}*/}
                {/*    >*/}
                {/*        <Typography.Text*/}
                {/*            style={{ fontSize: 16 }}*/}
                {/*            type={"secondary"}*/}
                {/*        >*/}
                {/*            {"Client secret"}*/}
                {/*        </Typography.Text>*/}
                {/*        <HighlightedText*/}
                {/*            style={{ fontSize: 16, fontWeight: "bold" }}*/}
                {/*            text={sberApiClient?.clientSecret ?? ""}*/}
                {/*        />*/}
                {/*    </Flex>*/}
                {/*) : (*/}
                {/*    <Skeleton.Node style={{ width: 150, height: 20 }} active />*/}
                {/*)}*/}
                {/*{!isLoading ? (*/}
                {/*    <Flex*/}
                {/*        style={{ width: "100%" }}*/}
                {/*        align={"start"}*/}
                {/*        justify={"center"}*/}
                {/*        vertical*/}
                {/*        gap={4}*/}
                {/*    >*/}
                {/*        <Typography.Text*/}
                {/*            style={{ fontSize: 16 }}*/}
                {/*            type={"secondary"}*/}
                {/*        >*/}
                {/*            {"Scope"}*/}
                {/*        </Typography.Text>*/}
                {/*        <HighlightedText*/}
                {/*            style={{ fontSize: 10, fontWeight: "bold" }}*/}
                {/*            text={sberApiClient?.scope ?? ""}*/}
                {/*            rowsCount={2}*/}
                {/*        />*/}
                {/*    </Flex>*/}
                {/*) : (*/}
                {/*    <Skeleton.Node style={{ width: 150, height: 20 }} active />*/}
                {/*)}*/}
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
                                    style={{ fontSize: 14 }}
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
                        {/*<HighlightedText*/}
                        {/*    style={{*/}
                        {/*        fontSize: 10,*/}
                        {/*        fontWeight: "bold",*/}
                        {/*        color: !sberApiClient?.accessToken*/}
                        {/*            ? ERROR_COLOR*/}
                        {/*            : dayjs(DateTimeHelper.Now()).isBefore(*/}
                        {/*                    dayjs(*/}
                        {/*                        sberApiClient?.accessTokenExpireDate,*/}
                        {/*                    ).format(),*/}
                        {/*                )*/}
                        {/*              ? PRIMARY_COLOR*/}
                        {/*              : ERROR_COLOR,*/}
                        {/*    }}*/}
                        {/*    text={sberApiClient?.accessToken ?? "отсутствует"}*/}
                        {/*/>*/}
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
                                    style={{ fontSize: 14 }}
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
                        {/*<HighlightedText*/}
                        {/*    style={{*/}
                        {/*        fontSize: 10,*/}
                        {/*        fontWeight: "bold",*/}
                        {/*        color: !sberApiClient?.refreshToken*/}
                        {/*            ? ERROR_COLOR*/}
                        {/*            : dayjs(DateTimeHelper.Now()).isBefore(*/}
                        {/*                    dayjs(*/}
                        {/*                        sberApiClient?.refreshTokenExpireDate,*/}
                        {/*                    ).format(),*/}
                        {/*                )*/}
                        {/*              ? PRIMARY_COLOR*/}
                        {/*              : ERROR_COLOR,*/}
                        {/*    }}*/}
                        {/*    text={sberApiClient?.refreshToken ?? "отсутствует"}*/}
                        {/*/>*/}
                    </Flex>
                ) : (
                    <Skeleton.Node style={{ width: 150, height: 20 }} active />
                )}
                {/*{!isLoading ? (*/}
                {/*    <Flex*/}
                {/*        style={{ width: "100%" }}*/}
                {/*        align={"start"}*/}
                {/*        justify={"center"}*/}
                {/*        vertical*/}
                {/*        gap={4}*/}
                {/*    >*/}
                {/*        <Typography.Text*/}
                {/*            style={{ fontSize: 16 }}*/}
                {/*            type={"secondary"}*/}
                {/*        >*/}
                {/*            {"ID token"}*/}
                {/*        </Typography.Text>*/}
                {/*        <HighlightedText*/}
                {/*            style={{*/}
                {/*                fontSize: 10,*/}
                {/*                fontWeight: "bold",*/}
                {/*                color: !sberApiClient?.idToken*/}
                {/*                    ? ERROR_COLOR*/}
                {/*                    : PRIMARY_COLOR,*/}
                {/*            }}*/}
                {/*            text={sberApiClient?.idToken ?? "отсутствует"}*/}
                {/*            rowsCount={2}*/}
                {/*        />*/}
                {/*    </Flex>*/}
                {/*) : (*/}
                {/*    <Skeleton.Node style={{ width: 150, height: 20 }} active />*/}
                {/*)}*/}
                {/*<Button*/}
                {/*    onClick={async () => {*/}
                {/*        try {*/}
                {/*            dispatch(*/}
                {/*                getClientInfoThunk({*/}
                {/*                    sberApiClientId: sberApiClient!.id!,*/}
                {/*                }),*/}
                {/*            )*/}
                {/*                .then((result) => {*/}
                {/*                    if (*/}
                {/*                        result.meta.requestStatus ===*/}
                {/*                        "fulfilled"*/}
                {/*                    ) {*/}
                {/*                        if (*/}
                {/*                            (*/}
                {/*                                result.payload as ResponseData<SberClientInfo>*/}
                {/*                            )?.isOk*/}
                {/*                        ) {*/}
                {/*                            success({*/}
                {/*                                message: JSON.stringify(*/}
                {/*                                    (*/}
                {/*                                        result.payload as ResponseData<SberClientInfo>*/}
                {/*                                    ).data.fullName,*/}
                {/*                                ),*/}
                {/*                            });*/}
                {/*                        }*/}
                {/*                    }*/}

                {/*                    if (*/}
                {/*                        result.meta.requestStatus === "rejected"*/}
                {/*                    ) {*/}
                {/*                        notificationError({*/}
                {/*                            message: String(result.payload),*/}
                {/*                        });*/}
                {/*                    }*/}
                {/*                })*/}
                {/*                .catch((err) => {*/}
                {/*                    notificationError({*/}
                {/*                        message: JSON.stringify(err.message),*/}
                {/*                    });*/}
                {/*                });*/}
                {/*        } catch (error) {*/}
                {/*            alert(error);*/}
                {/*        }*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {"Информация о клиенте"}*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    onClick={async () => {*/}
                {/*        try {*/}
                {/*            dispatch(*/}
                {/*                getUserInfoThunk({*/}
                {/*                    sberApiClientId: sberApiClient!.id!,*/}
                {/*                }),*/}
                {/*            )*/}
                {/*                .then((result) => {*/}
                {/*                    if (*/}
                {/*                        result.meta.requestStatus ===*/}
                {/*                        "fulfilled"*/}
                {/*                    ) {*/}
                {/*                        if (*/}
                {/*                            (*/}
                {/*                                result.payload as ResponseData<SberUserInfo>*/}
                {/*                            )?.isOk*/}
                {/*                        ) {*/}
                {/*                            success({*/}
                {/*                                message: JSON.stringify(*/}
                {/*                                    (*/}
                {/*                                        result.payload as ResponseData<SberUserInfo>*/}
                {/*                                    ).data.OrgName,*/}
                {/*                                ),*/}
                {/*                            });*/}
                {/*                        }*/}
                {/*                    }*/}

                {/*                    if (*/}
                {/*                        result.meta.requestStatus === "rejected"*/}
                {/*                    ) {*/}
                {/*                        notificationError({*/}
                {/*                            message: String(result.payload),*/}
                {/*                        });*/}
                {/*                    }*/}
                {/*                })*/}
                {/*                .catch((err) => {*/}
                {/*                    notificationError({*/}
                {/*                        message: JSON.stringify(err.message),*/}
                {/*                    });*/}
                {/*                });*/}
                {/*        } catch (error) {*/}
                {/*            alert(error);*/}
                {/*        }*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {"Информация о пользователе"}*/}
                {/*</Button>*/}
            </Flex>
        </Card>
    );
});
