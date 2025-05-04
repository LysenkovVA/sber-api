/**
 * https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */

import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["warn", "error"] // Доступно "query", "info", "warn", "error"
                : undefined,
        transactionOptions: {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
        },
    });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
