import { z } from "zod";

/**
 * Схема валидации SberApiClientEntity
 */
export const SberApiClientEntitySchema = z.object({
    login: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    scope: z.string(),
    accessToken: z.string().nullish(),
    accessTokenExpireDate: z.string().datetime({ offset: true }).nullish(),
    expiresIn: z.number().nullish(),
    refreshToken: z.string().nullish(),
    refreshTokenExpireDate: z.string().datetime({ offset: true }).nullish(),
    idToken: z.string().nullish(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export type SberApiClientEntity = z.infer<typeof SberApiClientEntitySchema> & {
    id: string;
};
