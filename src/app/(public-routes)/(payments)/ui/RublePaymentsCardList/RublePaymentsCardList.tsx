"use client";

import React, { memo, useCallback, useEffect } from "react";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { Col, Empty, Flex, Row } from "antd";
import { InfiniteScroll } from "@/app/UI/InfiniteScroll/ui/InfiniteScroll";
import {
    getRublePaymentsList,
    getRublePaymentsListError,
    getRublePaymentsListHasMore,
    getRublePaymentsListIsInitialized,
    getRublePaymentsListIsLoading,
    getRublePaymentsListTake,
} from "../../model/selectors/rublePaymentsListSelectors";
import { getRublePaymentsListThunk } from "../../model/thunks/getRublePaymentsListThunk";
import { rublePaymentsListReducer } from "../../model/slices/rublePaymentsListSlice";
import { useRouter } from "next/navigation";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { RublePaymentCard } from "@/app/(public-routes)/(payments)/ui/RublePaymentCard/RublePaymentCard";

export interface RublePaymentsCardListProps {
    columnsCount: 1 | 2 | 3 | 4 | 6 | 8;
}

export const RublePaymentsCardList = memo(
    (props: RublePaymentsCardListProps) => {
        const { columnsCount } = props;
        const router = useRouter();

        const dispatch = useAppDispatch();
        const isLoading = useAppSelector(getRublePaymentsListIsLoading);
        const error = useAppSelector(getRublePaymentsListError);
        const data = useAppSelector(getRublePaymentsList.selectAll);
        const hasMore = useAppSelector(getRublePaymentsListHasMore);
        const take = useAppSelector(getRublePaymentsListTake);
        const isInitialized = useAppSelector(getRublePaymentsListIsInitialized);

        const [notificationApi, contextHolder] = useNotification();

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getRublePaymentsListThunk({
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

        const loadNextPart = useCallback(() => {
            if (isInitialized && hasMore && !isLoading) {
                dispatch(
                    getRublePaymentsListThunk({
                        replaceData: false,
                    }),
                );
            }
        }, [isInitialized, hasMore, isLoading, dispatch]);

        return (
            <DynamicModuleLoader
                reducers={{ rublePaymentsListSchema: rublePaymentsListReducer }}
                removeAfterUnmount={false}
            >
                {contextHolder}
                <Flex align={"start"} justify={"center"} gap={8}>
                    <InfiniteScroll
                        onScrollEnd={loadNextPart}
                        height={`calc(${CONTENT_HEIGHT}`}
                    >
                        {isInitialized && !isLoading && data.length === 0 && (
                            <Empty />
                        )}
                        <Row
                            align={"top"}
                            justify={"start"}
                            gutter={[16, 8]}
                            style={{ width: "100%" }}
                        >
                            {data?.map((entity) => {
                                return (
                                    <Col
                                        key={entity.id}
                                        span={Number(24 / columnsCount)}
                                    >
                                        <RublePaymentCard
                                            rublePayment={entity}
                                        />
                                    </Col>
                                );
                            })}
                            {isLoading && (
                                <>
                                    {/*Показываем скелетоны карточек*/}
                                    {new Array(take).fill(0).map((_, index) => (
                                        <Col
                                            key={index}
                                            span={Number(24 / columnsCount)}
                                        >
                                            <RublePaymentCard isLoading />
                                        </Col>
                                    ))}
                                </>
                            )}
                        </Row>
                    </InfiniteScroll>
                    {/*<FloatButton*/}
                    {/*    type={"primary"}*/}
                    {/*    shape={"circle"}*/}
                    {/*    style={{*/}
                    {/*        border: `1px solid ${SECONDARY_VARIANT_COLOR}`,*/}
                    {/*        bottom: 90,*/}
                    {/*    }}*/}
                    {/*    icon={*/}
                    {/*        <PlusOutlined style={{ color: ON_SECONDARY_COLOR }} />*/}
                    {/*    }*/}
                    {/*    onClick={() => router.push("/rublePayments/create")}*/}
                    {/*/>*/}
                </Flex>
            </DynamicModuleLoader>
        );
    },
);
