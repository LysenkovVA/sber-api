"use client";

import React, { memo, ReactNode } from "react";
import { Layout } from "antd";
import {
    Content,
    Footer as AntFooter,
    Header as AntHeader,
} from "antd/es/layout/layout";
import {
    CONTENT_PADDING_BOTTOM,
    CONTENT_PADDING_LEFT,
    CONTENT_PADDING_RIGHT,
    CONTENT_PADDING_TOP,
    FOOTER_HEIGHT,
    HEADER_HEIGHT,
    SIDE_MENU_HEIGHT,
} from "../../config/consts";
import { Header } from "@/app/UI/AppLayout/ui/Header";
import { Footer } from "@/app/UI/AppLayout/ui/Footer/Footer";

export interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = memo(({ children }: AppLayoutProps) => {
    return (
        <Layout
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <AntHeader
                style={{
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                    height: HEADER_HEIGHT,
                    width: "100%",
                }}
            >
                <Header />
            </AntHeader>
            <Layout
                style={{
                    width: "100%",
                    height: SIDE_MENU_HEIGHT,
                }}
            >
                <Content
                    style={{
                        width: "100%",
                        height: SIDE_MENU_HEIGHT,
                        marginLeft: 0,
                        marginRight: 0,
                        paddingTop: CONTENT_PADDING_TOP,
                        paddingBottom: CONTENT_PADDING_BOTTOM,
                        paddingLeft: CONTENT_PADDING_LEFT,
                        paddingRight: CONTENT_PADDING_RIGHT,
                    }}
                >
                    {children}
                </Content>
            </Layout>
            <AntFooter
                style={{
                    height: FOOTER_HEIGHT,
                    margin: 0,
                    padding: 0,
                }}
            >
                <Footer />
            </AntFooter>
        </Layout>
    );
});
