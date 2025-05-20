"use client";

import React, { memo } from "react";
import { Button, Flex, Image, Typography } from "antd";
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
            <Flex align={"center"} justify={"center"} gap={0}>
                <Button type={"link"} href={"/sber-api-clients"}>
                    <Typography.Text style={{ fontSize: 24, color: "white" }}>
                        {"Клиенты"}
                    </Typography.Text>
                </Button>
                <Button type={"link"} href={"/payments"}>
                    <Typography.Text style={{ fontSize: 24, color: "white" }}>
                        {"Платежи"}
                    </Typography.Text>
                </Button>
            </Flex>
        </Flex>
    );
});
