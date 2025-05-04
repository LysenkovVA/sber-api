"use client";

import React, { memo } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Flex, Skeleton, Typography } from "antd";

export interface EditCardButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export const EditCardButton = memo((props: EditCardButtonProps) => {
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
                <EditOutlined style={{ color: "orange" }} />
            ) : (
                <Skeleton.Node active style={{ width: 40, height: 30 }} />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{ fontSize: 10, color: "orange" }}
                    type={"secondary"}
                >
                    {`Изменить`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
