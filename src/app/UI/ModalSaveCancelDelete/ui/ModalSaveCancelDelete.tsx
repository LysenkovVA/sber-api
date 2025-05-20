"use client";

import { memo } from "react";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import {
    FORM_ICON_SIZE,
    MODAL_TITLE_MARGIN_BOTTOM,
    MODAL_WIDTH,
} from "@/app/UI/AppLayout/config/consts";
import { Button, Flex, Modal } from "antd";

export interface ModalSaveCancelDeleteProps {
    iconSrc: string;
    title: string;
    children?: React.ReactNode;
    isOpen: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    onDelete?: () => void;
}

export const ModalSaveCancelDelete = memo(
    (props: ModalSaveCancelDeleteProps) => {
        const {
            children,
            title,
            iconSrc,
            isOpen,
            onOk,
            onCancel,
            onClose,
            onDelete,
        } = props;
        return (
            <Modal
                title={
                    <LabelWithIcon
                        textStyle={{
                            marginBottom: MODAL_TITLE_MARGIN_BOTTOM,
                        }}
                        imageSrc={iconSrc}
                        labelText={title}
                        iconSize={FORM_ICON_SIZE}
                    />
                }
                okType={"primary"}
                okText={"Сохранить"}
                cancelText={"Отмена"}
                onOk={onOk}
                onCancel={onCancel}
                onClose={onClose}
                footer={
                    <Flex align={"start"} justify={"space-between"}>
                        <Button
                            disabled={onDelete === undefined}
                            danger
                            onClick={onDelete}
                        >
                            Удалить
                        </Button>
                        <Flex align={"center"} justify={"center"} gap={8}>
                            <Button onClick={onCancel}>Отмена</Button>
                            <Button type={"primary"} onClick={onOk}>
                                Сохранить
                            </Button>
                        </Flex>
                    </Flex>
                }
                destroyOnClose
                open={isOpen}
                styles={{
                    body: {
                        maxHeight: "calc(100vh * 0.5)",
                        overflowY: "auto",
                    },
                }}
                width={MODAL_WIDTH}
            >
                {children}
            </Modal>
        );
    },
);
