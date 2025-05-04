"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Input, Skeleton } from "antd";
import { memo } from "react";
import imagePng from "../../../lib/assets/png/textField.png";

export interface FormItemInputProps {
    imageSrc?: string;
    labelText: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder: string;
    noStyle?: boolean;
}

export const FormItemInput = memo((props: FormItemInputProps) => {
    const {
        imageSrc = imagePng.src,
        labelText,
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
        placeholder = "",
        noStyle = undefined,
    } = props;
    return (
        <Form.Item
            noStyle={noStyle}
            label={
                <LabelWithIcon
                    imageSrc={imageSrc}
                    labelText={labelText}
                    iconSize={FORM_ICON_SIZE}
                />
            }
            name={namePath}
            rules={[
                {
                    required: required,
                    message: requiredMessage,
                },
            ]}
        >
            {!isLoading ? (
                <Input
                    id={namePath[0] ?? "field"}
                    autoComplete={"off"}
                    placeholder={placeholder}
                />
            ) : (
                <Skeleton.Input active block />
            )}
        </Form.Item>
    );
});
