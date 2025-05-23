import { EntityState } from "@reduxjs/toolkit";

export interface ListReduxSchema<EntityType, FilterType extends string>
    extends EntityState<EntityType, string> {
    isLoading?: boolean;
    error?: string;
    // Pagination
    take: number;
    skip: number;
    search?: string;
    filters?: OptionalRecord<FilterType, string[] | undefined>;
    totalCount: number;
    hasMore: boolean;
    // Initialization
    _isInitialized: boolean;
}
