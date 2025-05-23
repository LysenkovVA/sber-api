import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(
            `Неизвестная ошибка: ${error instanceof Error ? error.message : String(error)}`,
        );
        await prisma.$disconnect();
        process.exit(1);
    });
