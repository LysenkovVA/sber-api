"use client";

import React, { memo } from "react";
import { Flex } from "antd";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";
import { PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

export interface HeaderProps {}

export const Header = memo((props: HeaderProps) => {
    return (
        <Flex
            style={{
                backgroundColor: PRIMARY_COLOR,
                height: HEADER_HEIGHT,
                width: `100%`,
            }}
            align={"center"}
            justify={"start"}
        >
            <div style={{ paddingLeft: 16 }}>
                {"Тестирование интеграции со СБЕР API"}
            </div>
        </Flex>
    );
});
