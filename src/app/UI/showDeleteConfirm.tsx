import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

const { confirm } = Modal;

export const showDeleteConfirm = (
    title: string,
    description: string,
    okCallback: ((...args: any[]) => any) | undefined,
) => {
    confirm({
        title: title,
        icon: <DeleteOutlined style={{ color: "red" }} />,
        content: description,
        okText: "Да",
        okType: "danger",
        cancelText: "Нет",
        onOk() {
            okCallback?.();
        },
        onCancel() {
            // Нет колбэка
        },
    });
};
