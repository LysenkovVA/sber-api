"use client";
import { Button, Flex, Result } from "antd";
import { redirect } from "next/navigation";

export default function NotFound() {
    return (
        <Flex vertical>
            <Result status={"404"} title={"Страница не найдена"} />
            <Button onClick={() => redirect("/")}>{"На главную"}</Button>
        </Flex>
    );
}
