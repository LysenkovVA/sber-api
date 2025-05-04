"use client";

/**
 * Согласно документации (https://ant.design/docs/react/v5-for-19)
 * необходимо импортировать данную строку
 */
import "@ant-design/v5-patch-for-react-19";

import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import ru_RU from "antd/lib/locale/ru_RU";
import dayjs from "dayjs";
import { primaryTheme } from "@/app/lib/themes/primary-theme";

/**
 * Локализация
 */
dayjs.locale("ru");

/**
 * Провайдер для работы компонентов Ant Design в React 19
 *
 * В RootLayout импорт "@ant-design/nextjs-registry" вызывает ошибку, поэтому для всего функционала
 * Ant Design было решено использовать данную обертку
 *
 * @param children
 * @constructor
 */
export function React19AntdProvider({ children }: { children: ReactNode }) {
    return (
        <ConfigProvider locale={ru_RU} theme={primaryTheme}>
            <App
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AntdRegistry>{children}</AntdRegistry>
            </App>
        </ConfigProvider>
    );
}
