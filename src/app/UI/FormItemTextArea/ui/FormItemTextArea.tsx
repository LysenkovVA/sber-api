"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Input, Skeleton } from "antd";
import { memo } from "react";

export interface FormItemTextAreaProps {
    imageSrc?: string;
    labelText: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading?: boolean;
    placeholder?: string;
    noStyle?: boolean;
    rowsCount?: number;
}

export const FormItemTextArea = memo((props: FormItemTextAreaProps) => {
    const {
        imageSrc = "",
        labelText,
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
        placeholder = "",
        noStyle = undefined,
        rowsCount = 3,
    } = props;
    return (
        <Form.Item
            noStyle={noStyle}
            name={namePath}
            label={
                <LabelWithIcon
                    imageSrc={imageSrc}
                    labelText={labelText}
                    iconSize={FORM_ICON_SIZE}
                />
            }
            rules={[{ required: required, message: requiredMessage }]}
        >
            {!isLoading ? (
                <Input.TextArea
                    id={namePath[0]}
                    autoComplete={"off"}
                    placeholder={placeholder}
                    rows={rowsCount}
                />
            ) : (
                <Skeleton.Input
                    active
                    block
                    style={{ height: 25 * rowsCount }}
                />
            )}
        </Form.Item>
    );
});
