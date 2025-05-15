"use client";

import React, { memo } from "react";
import { PayCircleOutlined } from "@ant-design/icons";
import { Flex, Skeleton, Typography } from "antd";

export interface CreateRublePaymentButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export const CreateRublePaymentButton = memo(
    (props: CreateRublePaymentButtonProps) => {
        const { onClick, isLoading } = props;
        return (
            <Flex
                align={"center"}
                justify={"center"}
                vertical
                gap={4}
                onClick={onClick}
            >
                {!isLoading ? (
                    <PayCircleOutlined style={{ color: "blue" }} />
                ) : (
                    <Skeleton.Node active style={{ width: 40, height: 30 }} />
                )}
                {!isLoading ? (
                    <Typography.Text
                        style={{ fontSize: 10, color: "blue" }}
                        type={"secondary"}
                    >
                        {`Создать платеж`}
                    </Typography.Text>
                ) : null}
            </Flex>
        );
    },
);
