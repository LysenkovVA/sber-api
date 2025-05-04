import { createEntityAdapter } from "@reduxjs/toolkit";
import { SberApiClientEntity } from "../types/SberApiClientEntity";

export const sberApiClientAdapter = createEntityAdapter<
    SberApiClientEntity,
    string
>({
    selectId: (entity) => entity.id,
});
