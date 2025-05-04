"use client";

import { memo } from "react";
import { Typography } from "antd";

export interface HighlightedTextProps {
    style?: React.CSSProperties;
    text?: string;
    search?: string;
    rowsCount?: number;
}

// Function to highlight text
const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span
                        key={i}
                        style={{
                            backgroundColor: "#ffe58f",
                        }}
                    >
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                ),
            )}
        </>
    );
};

export const HighlightedText = memo((props: HighlightedTextProps) => {
    const { style, text, search, rowsCount = undefined } = props;

    if (
        text === undefined ||
        text === "" ||
        search === undefined ||
        search === "" ||
        !text.toUpperCase().includes(search.toUpperCase())
    ) {
        return (
            <Typography.Paragraph
                style={{
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                    // margin: 0,
                    ...style,
                    marginBottom: 0,
                }}
                ellipsis={rowsCount ? { rows: rowsCount } : undefined}
            >
                {text}
            </Typography.Paragraph>
        );
    }

    return (
        <Typography.Paragraph
            style={{
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
                // margin: 0,
                ...style,
                marginBottom: 0,
            }}
            ellipsis={rowsCount ? { rows: rowsCount } : undefined}
        >
            {highlightText(text, search)}
        </Typography.Paragraph>
    );
});
