import { z, ZodError } from "zod";

export async function validateObject<S extends z.ZodType<z.infer<S>, any>>(
    schema: S,
    // data: z.infer<S>,
    data: any,
): Promise<z.infer<S>> {
    const result = schema.safeParse(data);

    if (!result.success) {
        if (result.error?.errors) {
            throw new ZodError<S>(result.error!.errors);
        } else {
            throw new ZodError<S>([
                {
                    message:
                        "Неизвестная ошибка в функции валидации (validateObject)",
                    path: ["validateObject"],
                    code: "custom",
                },
            ]);
        }
    } else {
        return result.data as z.infer<S>;
    }
}

export function validateObjectSync<S extends z.ZodType<z.infer<S>, any>>(
    schema: S,
    data: z.infer<S>,
): z.infer<S> {
    const result = schema.safeParse(data);

    if (!result.success) {
        if (result.error?.errors) {
            throw new ZodError<S>(result.error!.errors);
        } else {
            throw new ZodError<S>([
                {
                    message:
                        "Неизвестная ошибка в функции валидации (validateObject)",
                    path: ["validateObject"],
                    code: "custom",
                },
            ]);
        }
    } else {
        return result.data as z.infer<S>;
    }
}
