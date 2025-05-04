import React, { memo } from "react";
import { Button, Card, Flex, Typography } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

export interface EditableCardWrapperProps {
    children?: React.ReactNode;
    title?: string;
    additionalTitle?: string;
    onSave?: () => void;
    onCancel?: () => void;
    height: number | string;
}

export const EditablePageWrapper = memo((props: EditableCardWrapperProps) => {
    const { children, title, additionalTitle, onSave, onCancel, height } =
        props;

    const extraContent = (
        <Flex gap={8}>
            <Button icon={<SaveOutlined />} type={"primary"} onClick={onSave}>
                {"Сохранить"}
            </Button>
        </Flex>
    );

    const titleContent = (
        <Flex gap={16}>
            <Button
                type={"dashed"}
                onClick={onCancel}
                icon={<ArrowLeftOutlined />}
            />
            <Flex align={"center"} gap={8}>
                <Typography.Text style={{ fontSize: 16 }} type={"danger"}>
                    {title}
                </Typography.Text>
                {additionalTitle && (
                    <Typography.Text
                        style={{ fontSize: 16 }}
                        type={"secondary"}
                    >
                        {`"${additionalTitle}"`}
                    </Typography.Text>
                )}
            </Flex>
        </Flex>
    );

    return (
        <Card
            styles={{
                body: {
                    width: "100%",
                    height: `calc(${height} - 54px)`,
                    overflowY: "auto",
                },
            }}
            title={titleContent}
            extra={extraContent}
        >
            {children}
        </Card>
    );
});
