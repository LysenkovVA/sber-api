import { createEntityAdapter } from "@reduxjs/toolkit";
import { RublePaymentEntity } from "@/app/(public-routes)/(payments)/model/types/RublePaymentEntity";

export const rublePaymentAdapter = createEntityAdapter<
    RublePaymentEntity,
    string
>({
    selectId: (entity) => entity.id,
});
