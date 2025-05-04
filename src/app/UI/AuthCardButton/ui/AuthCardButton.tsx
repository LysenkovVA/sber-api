"use client";

import React, { memo } from "react";
import { LoginOutlined } from "@ant-design/icons";
import { Flex, Skeleton, Typography } from "antd";
import { PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

export interface AuthCardButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export const AuthCardButton = memo((props: AuthCardButtonProps) => {
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
                <LoginOutlined style={{ color: PRIMARY_COLOR }} />
            ) : (
                <Skeleton.Node active style={{ width: 40, height: 30 }} />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{
                        fontSize: 10,
                        color: PRIMARY_COLOR,
                        fontWeight: "bold",
                    }}
                    type={"secondary"}
                >
                    {`Авторизоваться`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
