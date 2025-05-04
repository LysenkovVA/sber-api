"use client";

import { memo, ReactNode, useEffect, useRef } from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useThrottle } from "../hooks/useThrottle";
import {
    GlobalStateSchema,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import { InfiniteScrollActions } from "../model/slices/InfiniteScrollSlice";
import { usePathname } from "next/navigation";
import { getInfiniteScrollByPath } from "../model/selectors/infiniteScrollSelectors";

export interface InfinitePageProps {
    children: ReactNode;
    height: number | string;
    onScrollEnd?: () => void;
}

export const InfiniteScroll = memo((props: InfinitePageProps) => {
    const { children, onScrollEnd, height } = props;
    const pathname = usePathname();

    const dispatch = useAppDispatch();
    const scrollPosition = useAppSelector((state: GlobalStateSchema) =>
        getInfiniteScrollByPath(state, pathname),
    );

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.scrollTop = scrollPosition;
        }
    }, []);

    useInfiniteScroll({
        wrapperRef: wrapperRef,
        triggerRef,
        onIntersectCallback: onScrollEnd,
    });

    // Позиция скролла сохраняется в Redux с временным интервалом
    const onScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
        dispatch(
            InfiniteScrollActions.setScrollPosition({
                position: e.currentTarget.scrollTop,
                path: pathname,
            }),
        );
    }, 500);

    return (
        <main
            ref={wrapperRef}
            style={{
                width: "100%",
                height: height,
                overflowY: "auto",
            }}
            onScroll={onScroll}
        >
            {children}
            {/*В конце страницы в случае отслеживания события onScrollEnd помещаем элемент,
            по которому будет определяться пересечение и срабатывать событие onScrollEnd из хука useInfiniteScroll*/}
            {onScrollEnd ? (
                <div style={{ height: 20, margin: 10 }} ref={triggerRef} />
            ) : null}
        </main>
    );
});
