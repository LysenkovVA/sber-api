"use client";

import React, { memo } from "react";
import { Flex, Skeleton, Typography } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";

export interface RefreshTokensButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export const RefreshTokensButton = memo((props: RefreshTokensButtonProps) => {
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
                <CoffeeOutlined style={{ color: "blue" }} />
            ) : (
                <Skeleton.Node active style={{ width: 40, height: 30 }} />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{ fontSize: 10, color: "blue" }}
                    type={"secondary"}
                >
                    {`Обновить токены`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
