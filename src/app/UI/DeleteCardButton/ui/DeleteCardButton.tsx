"use client";

import React, { memo } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Flex, Skeleton, Typography } from "antd";

export interface DeleteCardButton {
    onClick?: () => void;
    isLoading?: boolean;
}

export const DeleteCardButton = memo((props: DeleteCardButton) => {
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
                <DeleteOutlined style={{ color: "tomato" }} />
            ) : (
                <Skeleton.Node active style={{ width: 40, height: 30 }} />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{ fontSize: 10, color: "tomato" }}
                    type={"secondary"}
                >
                    {`Удалить`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
