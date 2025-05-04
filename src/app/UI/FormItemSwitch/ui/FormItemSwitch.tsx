import { memo } from "react";
import { Form, Skeleton, Switch } from "antd";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";

export interface FormItemSwitchProps {
    imageSrc: string;
    labelText: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    noStyle?: boolean;
}

export const FormItemSwitch = memo((props: FormItemSwitchProps) => {
    const {
        imageSrc,
        labelText,
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
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
                <Switch id={namePath[0] ?? "field"} />
            ) : (
                <Skeleton.Input active block />
            )}
        </Form.Item>
    );
});
