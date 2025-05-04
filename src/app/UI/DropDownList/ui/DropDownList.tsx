"use client";

import { memo } from "react";
import { Button, Flex, Select, SelectProps, Space, Tag } from "antd";
import {
    EditFilled,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

export type DropDownOption = {
    value: string; // Идентификатор
    label: string; // То, что показано пользователю
};

export interface DropDownListProps {
    placeholder?: string;
    mode?: "single" | "multiple";
    maxMultipleCount?: number;
    showSearch?: boolean;
    options: DropDownOption[];
    value?: string | string[];
    isLoading?: boolean;
    onChange?: (value?: string | string[]) => void;
    onAddClick?: () => void;
    onEditClick?: (value?: string) => void;
    onDeleteClick?: (value?: string) => void;
}

type TagRender = SelectProps["tagRender"];

export const DropDownList = memo((props: DropDownListProps) => {
    const {
        placeholder,
        mode = "single",
        maxMultipleCount = undefined,
        showSearch = true,
        options,
        value,
        isLoading,
        onChange,
        onAddClick,
        onEditClick,
        onDeleteClick,
    } = props;

    const tagRender: TagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (
            event: React.MouseEvent<HTMLSpanElement>,
        ) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginInlineEnd: 4 }}
            >
                <Space size={"small"}>
                    {label}
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => onEditClick?.(value)}
                    />
                </Space>
            </Tag>
        );
    };

    return (
        <Flex
            style={{ width: "100%" }}
            align={"center"}
            justify={"center"}
            gap={4}
        >
            <Select
                disabled={isLoading}
                style={{ width: "100%", textAlign: "start" }}
                placeholder={placeholder}
                mode={mode === "single" ? undefined : "multiple"}
                tagRender={tagRender}
                maxCount={mode === "single" ? undefined : maxMultipleCount}
                showSearch={showSearch}
                allowClear
                options={options}
                optionFilterProp={"label"}
                value={value}
                onChange={(value) => {
                    onChange?.(value);
                }}
            />
            {mode === "single" && onEditClick && (
                <Button
                    disabled={value === undefined}
                    icon={<EditFilled style={{ color: "orange" }} />}
                    onClick={() => {
                        if (typeof value === "string") {
                            onEditClick(value);
                        }
                    }}
                />
            )}
            {onAddClick && (
                <Button
                    type={"primary"}
                    icon={<PlusCircleOutlined />}
                    onClick={onAddClick}
                />
            )}
        </Flex>
    );
});
