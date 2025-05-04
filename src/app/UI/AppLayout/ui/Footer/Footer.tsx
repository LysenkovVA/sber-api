"use client";

import React, { memo } from "react";
import { Flex, Typography } from "antd";
import { FOOTER_HEIGHT, FOOTER_WIDTH } from "@/app/UI/AppLayout/config/consts";
import {
    ON_PRIMARY_COLOR,
    PRIMARY_COLOR,
} from "@/app/lib/themes/primary-theme";

export const Footer = memo(() => {
    return (
        <Flex
            style={{
                width: FOOTER_WIDTH,
                height: FOOTER_HEIGHT,
                backgroundColor: PRIMARY_COLOR,
            }}
            align={"center"}
            justify={"center"}
        >
            <Typography.Text style={{ color: ON_PRIMARY_COLOR }}>
                {`SBER API © Лысенков Виктор (${new Date(Date.now()).getFullYear()})`}
            </Typography.Text>
        </Flex>
    );
});
