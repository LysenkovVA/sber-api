import { EntityState } from "@reduxjs/toolkit";

export interface SimpleListReduxSchema<EntityType>
    extends EntityState<EntityType, string> {
    isLoading?: boolean;
    error?: string;
    // Флаг для того, что данные необходимо полностью обновить
    refreshDataNeeded: boolean;
    _isInitialized: boolean;
}
