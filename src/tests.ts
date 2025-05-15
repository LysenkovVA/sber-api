import { z } from "zod";

export const TestSchema = z.object({
    login: z.string(),
    date: z.string().datetime({ offset: true }).nullish(),
});

type TestType = z.infer<typeof TestSchema>;

const notValidatedData = {
    login: "user",
    date: "2025-05-14T09:08:01+03:00",
};

const validatedData = TestSchema.parse(notValidatedData);

console.log(JSON.stringify(validatedData, null, 2));
