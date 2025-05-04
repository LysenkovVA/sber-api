"use client"; // Error boundaries должны быть клиентскими компонентами

import { useEffect } from "react";
import useNotification from "antd/es/notification/useNotification";
import { Collapse, Flex, Result } from "antd";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [notificationApi, contextHolder] = useNotification();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <>
            {contextHolder}
            <Flex vertical align={"center"} justify={"center"} gap={4}>
                <Result
                    status={"error"}
                    title={error.message}
                    subTitle={error.digest}
                />
                {process.env.NODE_ENV !== "production" && (
                    <Collapse
                        style={{ width: "80%" }}
                        items={[
                            {
                                key: "1",
                                label: "Stack",
                                children: (
                                    <p
                                        style={{
                                            width: "100%",
                                            height: 300,
                                            overflowY: "auto",
                                        }}
                                    >
                                        {error.stack}
                                    </p>
                                ),
                            },
                        ]}
                    />
                )}
            </Flex>
        </>
    );
}
