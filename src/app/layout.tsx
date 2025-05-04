import type { Metadata } from "next";
import { React19AntdProvider } from "@/app/lib/providers/React19AntdProvider";
import { ClientErrorBoundary } from "@/app/lib/providers/ClientErrorBoundary";
import "./globals.css";
import { StoreProvider } from "@/app/lib/store";
import { AppLayout } from "@/app/UI/AppLayout";

export const metadata: Metadata = {
    title: "СБЕР API",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body>
                <ClientErrorBoundary>
                    <StoreProvider>
                        <React19AntdProvider>
                            <AppLayout>{children}</AppLayout>
                        </React19AntdProvider>
                    </StoreProvider>
                </ClientErrorBoundary>
            </body>
        </html>
    );
}
