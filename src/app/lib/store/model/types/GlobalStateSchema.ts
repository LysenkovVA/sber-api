import { Action, Reducer, ReducersMapObject } from "redux";
import { InfiniteScrollSchema } from "@/app/UI/InfiniteScroll/model/types/InfiniteScrollSchema";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { SberApiClientEntity } from "@/app/(public-routes)/(sber-api-clients)/model/types/SberApiClientEntity";
import { DetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { RublePaymentEntity } from "@/app/(public-routes)/(SBER-API)/model/types/ruble-payments/RublePaymentEntity";

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
    // Обязательные составляющие
    // Позиции скроллов для бесконечных страниц
    infiniteScrollSchema: InfiniteScrollSchema;
    sberApiClientsSimpleListSchema?: SimpleListReduxSchema<SberApiClientEntity>;
    sberApiClientDetailsSchema?: DetailsReduxSchema<SberApiClientEntity>;
    rublePaymentDetailsSchema?: DetailsReduxSchema<RublePaymentEntity>;
}

/**
 * Ключи глобальной схемы состояния
 */
export type GlobalStateSchemaKey = keyof GlobalStateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<GlobalStateSchema>;
    reduce: (state: GlobalStateSchema | undefined, action: Action) => any;
    add: (key: GlobalStateSchemaKey, reducer: Reducer) => void;
    remove: (key: GlobalStateSchemaKey) => void;
}
