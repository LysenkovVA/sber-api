"use client";

import React, { memo } from "react";
import { ClearOutlined } from "@ant-design/icons";
import { Flex, Skeleton, Typography } from "antd";

export interface ClearTokensButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export const ClearTokensButton = memo((props: ClearTokensButtonProps) => {
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
                <ClearOutlined style={{ color: "blue" }} />
            ) : (
                <Skeleton.Node active style={{ width: 40, height: 30 }} />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{ fontSize: 10, color: "blue" }}
                    type={"secondary"}
                >
                    {`Очистить токены`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
