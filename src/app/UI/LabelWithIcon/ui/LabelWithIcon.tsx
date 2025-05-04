"use client";

import React, { CSSProperties, memo } from "react";
import { Flex, Image, Typography } from "antd";

export interface LabelWithIconProps {
    style?: CSSProperties;
    imageSrc: string;
    labelFontSize?: number;
    labelText: string;
    iconSize: number;
}

export const LabelWithIcon = memo((props: LabelWithIconProps) => {
    const { style, imageSrc, labelFontSize = 14, labelText, iconSize } = props;

    return (
        <Flex
            align={"center"}
            justify={"start"}
            gap={8}
            style={{ lineHeight: 0, width: "100%", ...style }}
        >
            <Image
                src={imageSrc}
                preview={false}
                alt={""}
                width={iconSize}
                height={iconSize}
            />
            <Typography.Text
                style={{ fontSize: labelFontSize }}
                // type={"secondary"}
            >
                {labelText}
            </Typography.Text>
        </Flex>
    );
});
