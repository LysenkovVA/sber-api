import { Flex, Typography } from "antd";

export const formRequiredMark = (
    label: React.ReactNode,
    { required }: { required: boolean },
) => (
    <Flex align={"end"} justify={"center"} vertical>
        {label}
        {required ? (
            <Typography.Text
                style={{
                    fontSize: 10,
                    color: "lightsteelblue",
                    padding: 0,
                    margin: 0,
                }}
                // color="error"
            >
                обязательно
            </Typography.Text>
        ) : undefined}
    </Flex>
);
