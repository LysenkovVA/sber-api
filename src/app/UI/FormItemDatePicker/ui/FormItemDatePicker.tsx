"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { DatePicker, Form, Skeleton } from "antd";
import { memo } from "react";
import dayjs from "dayjs";
import ru_RU from "antd/lib/locale/ru_RU";
import imagePng from "../../../lib/assets/png/calendar.png";

export interface FormItemDatePickerProps {
    imageSrc?: string;
    labelText: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder: string;
    noStyle?: boolean;
}

export const FormItemDatePicker = memo((props: FormItemDatePickerProps) => {
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
            name={namePath}
            label={
                <LabelWithIcon
                    imageSrc={imageSrc}
                    labelText={labelText}
                    iconSize={FORM_ICON_SIZE}
                />
            }
            rules={[{ required: required, message: requiredMessage }]}
            getValueProps={(value) => ({
                value: value && dayjs(value),
            })}
            normalize={(value) => value && `${dayjs(value).toISOString()}`}
        >
            {!isLoading ? (
                <DatePicker
                    id={namePath[0]}
                    autoComplete={"off"}
                    placeholder={placeholder}
                    format={"DD.MM.YYYY"}
                    locale={ru_RU.DatePicker}
                    style={{ width: "100%" }}
                />
            ) : (
                <Skeleton.Input active block />
            )}
        </Form.Item>
    );
});
