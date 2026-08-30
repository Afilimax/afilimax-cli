import readlineSync from "readline-sync"

import { areCookiesValid, getCookiesEarliestExpiry, loadConfig, updateConfig } from "../../../helpers/config.helper"
import { logError, logInfo, logSuccess, logWarning } from "../../../helpers/logger.helper"
import { collectCookiesViaBrowser, collectCookiesViaExtension } from "./cookie-collector"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const cyan = "\x1b[38;2;80;200;240m"
const gray = "\x1b[38;2;140;140;140m"
const gold = "\x1b[38;2;255;200;0m"

function promptCollectionMethod(): "extension" | "browser" {
    console.log(`
  ${bold}${gold}🍪 Configuração — Amazon Associates${reset}
  ${gray}────────────────────────────────────────────────────${reset}

  Como deseja fornecer os cookies?

    ${cyan}[1]${reset} Colar cookies exportados pela extensão ${gold}(recomendado)${reset}
    ${cyan}[2]${reset} Abrir navegador e fazer login do zero
`)

    const index = readlineSync.keyInSelect(
        ["Exportar via extensão (recomendado)", "Abrir navegador e fazer login"],
        "Escolha: ",
        { cancel: false },
    )

    return index === 0 ? "extension" : "browser"
}

export async function runAmazonConfig(): Promise<void> {
    const config = loadConfig()

    if (config.amazon?.cookies && areCookiesValid(config.amazon.cookies, "amazon")) {
        const expiry = getCookiesEarliestExpiry(config.amazon.cookies, "amazon")
        logWarning(
            `Amazon já configurado. Cookies válidos${expiry ? ` até ${expiry.toLocaleDateString("pt-BR")}` : ""}.`,
        )

        const overwrite = readlineSync.keyInYNStrict("Deseja reconfigurar?")
        if (!overwrite) {
            logInfo("Configuração mantida.")
            return
        }
    }

    const method = promptCollectionMethod()

    try {
        const cookies = method === "extension" ? collectCookiesViaExtension() : await collectCookiesViaBrowser()

        if (!areCookiesValid(cookies, "amazon")) {
            logWarning("Alguns cookies principais estão expirados. A geração de links pode falhar.")
        }

        updateConfig({ amazon: { cookies } })
        logSuccess(`Cookies da Amazon salvos! (${cookies.length} cookie(s))`)
    } catch (err) {
        logError("Falha ao salvar cookies da Amazon", err)
    }
}
