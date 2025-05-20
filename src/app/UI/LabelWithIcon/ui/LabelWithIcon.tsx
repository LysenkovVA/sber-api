"use client";

import React, { CSSProperties, memo } from "react";
import { Flex, Image } from "antd";
import { HighlightedText } from "@/app/UI/HighlightedText/HighlightedText";

export interface LabelWithIconProps {
    textStyle?: CSSProperties;
    imageSrc?: string;
    labelFontSize?: number;
    labelText?: string;
    iconSize: number;
    search?: string;
    disabled?: boolean;
}

export const LabelWithIcon = memo((props: LabelWithIconProps) => {
    const {
        textStyle,
        imageSrc,
        labelFontSize = 14,
        labelText,
        iconSize,
        search = "",
        disabled = false,
    } = props;

    return (
        <Flex
            align={"center"}
            justify={"start"}
            gap={8}
            style={{ lineHeight: 0, width: "100%", ...textStyle }}
        >
            {imageSrc && (
                <Image
                    src={imageSrc}
                    preview={false}
                    alt={""}
                    width={iconSize}
                    height={iconSize}
                />
            )}
            <HighlightedText
                disabled={disabled}
                style={{
                    ...textStyle,
                }}
                text={labelText ?? ""}
                search={search}
            />
        </Flex>
    );
});
