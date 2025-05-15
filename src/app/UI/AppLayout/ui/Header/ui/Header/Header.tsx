"use client";

import React, { memo } from "react";
import { Flex, Image, Typography } from "antd";
import {
    ON_PRIMARY_COLOR,
    PRIMARY_COLOR,
} from "@/app/lib/themes/primary-theme";
import { useRouter } from "next/navigation";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";
import logoPng from "../../../../../../../../public/sber.png";

export interface HeaderProps {}

export const Header = memo((props: HeaderProps) => {
    const router = useRouter();

    return (
        <Flex
            style={{
                backgroundColor: PRIMARY_COLOR,
                height: HEADER_HEIGHT,
                // width: `100%`,
                paddingLeft: 16,
            }}
            align={"center"}
            justify={"start"}
            gap={8}
        >
            <Image
                src={logoPng.src}
                alt={"logo"}
                height={HEADER_HEIGHT}
                preview={false}
            />
            <Typography.Text
                style={{
                    color: ON_PRIMARY_COLOR,
                    fontSize: 26,
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
                onClick={() => {
                    router.push("/");
                }}
            >
                {"Тестирование СБЕР API"}
            </Typography.Text>
        </Flex>
    );
});
