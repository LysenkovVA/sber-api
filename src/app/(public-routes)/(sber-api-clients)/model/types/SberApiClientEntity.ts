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

export type SberApiClientEntity = Omit<
    z.infer<typeof SberApiClientEntitySchema>,
    "id"
    // | "accessTokenExpireDate"
    // | "refreshTokenExpireDate"
    // | "createdAt"
    // | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    // accessTokenExpireDate?: Date | null;
    // refreshTokenExpireDate?: Date | null;
    // createdAt?: Date | null;
    // updatedAt?: Date | null;
};
