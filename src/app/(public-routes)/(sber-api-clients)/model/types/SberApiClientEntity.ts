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
    expiresIn: z.number().nullish(),
    refreshToken: z.string().nullish(),
    idToken: z.string().nullish(),
});

export type SberApiClientEntity = Omit<
    z.infer<typeof SberApiClientEntitySchema>,
    "id" | "createdAt" | "updatedAt"
> & {
    id: string; // Идентификатор необходим для схем redux
    createdAt?: Date;
    updatedAt?: Date;
};
