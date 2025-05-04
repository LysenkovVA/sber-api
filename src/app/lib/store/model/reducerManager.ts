import { Action, combineReducers, Reducer, ReducersMapObject } from "redux";
import {
    GlobalStateSchema,
    GlobalStateSchemaKey,
    ReducerManager,
} from "./types/GlobalStateSchema";

export function createReducerManager(
    initialReducers: ReducersMapObject<GlobalStateSchema>,
): ReducerManager {
    // Create an object which maps keys to reducers
    const reducers = { ...initialReducers };

    // Create the initial combinedReducer
    let combinedReducer = combineReducers(reducers);

    // An array which is used to delete state keys when reducers are removed
    let keysToRemove: GlobalStateSchemaKey[] = [];

    return {
        getReducerMap: () => reducers,

        // The root reducer function exposed by this object
        // This will be passed to the store
        reduce: (state: GlobalStateSchema | undefined, action: Action): any => {
            // Если какие-то редюсеры были удалены, убираем сперва их из состояния
            if (state && keysToRemove.length > 0) {
                state = { ...state };

                for (const key of keysToRemove) {
                    // @ts-ignore
                    delete state[key];
                }
                keysToRemove = [];
            }

            // @ts-ignore
            return combinedReducer(state, action);
        },

        // Добавление редюсера по ключу
        add: (key: GlobalStateSchemaKey, reducer: Reducer) => {
            if (!key || reducers[key]) {
                return;
            }
            reducers[key] = reducer;
            combinedReducer = combineReducers(reducers);
        },

        // Удаление редюсера по ключу
        remove: (key: GlobalStateSchemaKey) => {
            if (!key || !reducers[key]) {
                return;
            }

            // @ts-ignore
            delete reducers[key];
            keysToRemove.push(key);
            combinedReducer = combineReducers(reducers);
        },
    };
}
