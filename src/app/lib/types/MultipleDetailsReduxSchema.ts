export interface DetailsReduxSchema<EntityType> {
    entityData?: EntityType;
    entityFormData?: EntityType;
    isFetching: boolean;
    isSaving: boolean;
    error?: string;
    _isInitialized: boolean;
}

export interface MultipleDetailsReduxSchema<EntityType> {
    // Идентификатор формы, детальная информация
    details: Record<string, DetailsReduxSchema<EntityType>>;
}
