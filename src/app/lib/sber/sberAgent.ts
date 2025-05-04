"use server"

import * as https from "https"
import fs from "fs/promises"
import path from "node:path"

export async function getSberAgent() {
    // С запросом необходимо отправить сертификат, поскольку бэкенд ничего
    // не знает про сертификаты, установленные на клиенте
    const pfx = await fs.readFile(path.join(process.cwd(), ".cert", "SberBusinessAPI08092023.pfx"))

// Создаем агент для запроса
    const agent = new https.Agent({
        // Сертификат
        pfx: pfx,
        // Пароль сертификата
        passphrase: "testtest",
        keepAlive: true,
        // Версия протокола
        minVersion: "TLSv1.3",
        // Игнорирование ошибки сети SELF_SIGNED_CERT_IN_CHAIN. Без этой ошибки fetch будет бросать исключение
        rejectUnauthorized: false
    })

    return agent
}

