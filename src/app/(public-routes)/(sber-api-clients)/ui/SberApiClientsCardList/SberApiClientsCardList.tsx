"use client";

import React, { memo, useEffect } from "react";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { Col, Empty, Flex, FloatButton, Row } from "antd";
import { InfiniteScroll } from "@/app/UI/InfiniteScroll/ui/InfiniteScroll";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    getSberApiClientsSimpleList,
    getSberApiClientsSimpleListError,
    getSberApiClientsSimpleListIsInitialized,
    getSberApiClientsSimpleListIsLoading,
} from "@/app/(public-routes)/(sber-api-clients)/model/selectors/sberApiClientSimpleListSelectors";
import { getSberApiClientsSimpleListThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/getSberApiClientsSimpleListThunk";
import { sberApiClientsSimpleListReducer } from "@/app/(public-routes)/(sber-api-clients)/model/slices/sberApiClientsSimpleListSlice";
import { SberApiClientCard } from "@/app/(public-routes)/(sber-api-clients)/ui/SberApiClientCard/SberApiClientCard";
import { updateSberApiClientTokensThunk } from "@/app/(public-routes)/(sber-api-clients)/model/thunks/updateSberApiClientTokensThunk";

export interface SberApiClientsCardListProps {
    columnsCount: 1 | 2 | 3 | 4 | 6 | 8;
}

export const SberApiClientsCardList = memo(
    (props: SberApiClientsCardListProps) => {
        const { columnsCount } = props;
        const router = useRouter();

        const searchParams = useSearchParams();
        const code = searchParams.get("code");
        const id = searchParams.get("state");
        const errorParam = searchParams.get("error");
        const errorDescriptionParam = searchParams.get("error_description");

        const dispatch = useAppDispatch();
        const isLoading = useAppSelector(getSberApiClientsSimpleListIsLoading);
        const error = useAppSelector(getSberApiClientsSimpleListError);
        const data = useAppSelector(getSberApiClientsSimpleList.selectAll);
        // const hasMore = useAppSelector(getSberApiClientsListHasMore);
        // const take = useAppSelector(getSberApiClientsListTake);
        const isInitialized = useAppSelector(
            getSberApiClientsSimpleListIsInitialized,
        );

        const [notificationApi, contextHolder] = useNotification();

        useEffect(() => {
            if (code && id) {
                // alert(`Code: ${code}; ID: ${id}`);
                dispatch(
                    updateSberApiClientTokensThunk({
                        entityId: id,
                        code: code,
                    }),
                ).then((result) => {
                    if (result.meta.requestStatus === "fulfilled") {
                        router.replace("/sber-api-clients");
                        notificationApi.info({ message: "Токены обновлены!" });
                    }
                });
            }
        }, [code, dispatch, id, notificationApi, router]);

        useEffect(() => {
            if (errorParam || errorDescriptionParam) {
                notificationApi.error({
                    message: errorParam,
                    description: errorDescriptionParam,
                });
            }
        }, [errorDescriptionParam, errorParam, notificationApi]);

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getSberApiClientsSimpleListThunk({
                        replaceData: true,
                    }),
                );
            }
        });

        useEffect(() => {
            if (error) {
                notificationApi.error({
                    message: "Ошибка",
                    description: error,
                });
            }
        }, [error, notificationApi]);

        // const loadNextPart = useCallback(() => {
        //     if (isInitialized && hasMore && !isLoading) {
        //         dispatch(
        //             getSberApiClientsListThunk({
        //                 replaceData: false,
        //             }),
        //         );
        //     }
        // }, [isInitialized, hasMore, isLoading, dispatch]);

        return (
            <DynamicModuleLoader
                reducers={{
                    sberApiClientsSimpleListSchema:
                        sberApiClientsSimpleListReducer,
                }}
                removeAfterUnmount={false}
            >
                {contextHolder}
                <Flex align={"start"} justify={"center"} gap={16}>
                    <FloatButton
                        type={"primary"}
                        shape={"circle"}
                        style={{ bottom: 90 }}
                        icon={<PlusOutlined />}
                        onClick={() => router.push("/sber-api-clients/create")}
                    />
                    <InfiniteScroll
                        onScrollEnd={() => {}}
                        height={CONTENT_HEIGHT}
                    >
                        {isInitialized && !isLoading && data.length === 0 && (
                            <Empty />
                        )}
                        <Row align={"top"} justify={"start"} gutter={[16, 16]}>
                            {data?.map((entity) => {
                                return (
                                    <Col
                                        key={entity.id}
                                        span={Number(24 / columnsCount)}
                                    >
                                        <SberApiClientCard
                                            sberApiClient={entity}
                                        />
                                    </Col>
                                );
                            })}
                            {isLoading && (
                                <>
                                    {/*Показываем скелетоны карточек*/}
                                    {new Array(1).fill(0).map((_, index) => (
                                        <Col
                                            key={index}
                                            span={Number(24 / columnsCount)}
                                        >
                                            <SberApiClientCard isLoading />
                                        </Col>
                                    ))}
                                </>
                            )}
                        </Row>
                    </InfiniteScroll>
                </Flex>
            </DynamicModuleLoader>
        );
    },
);
