"use client";

import React, { memo } from "react";
import { Flex, Skeleton, Typography } from "antd";
import { DisconnectOutlined } from "@ant-design/icons";

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
                <DisconnectOutlined style={{ color: "red" }} />
            ) : (
                <Skeleton.Node active style={{ width: 40, height: 30 }} />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{ fontSize: 10, color: "red" }}
                    type={"secondary"}
                >
                    {`Отключиться`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
