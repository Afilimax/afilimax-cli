import readlineSync from "readline-sync"

import { Cookie } from "../../../helpers/config.helper"
import { logInfo, logSuccess } from "../../../helpers/logger.helper"
import { createStealthBrowser, getBrowserExecutablePath } from "../../../helpers/puppeteer.helper"

const ML_URL = "https://www.mercadolivre.com.br"
const EXTENSION_URL =
    "https://chromewebstore.google.com/detail/export-cookie-json-file-f/nmckokihipjgplolmcmjakknndddifde"
const LOGIN_INDICATOR_SELECTOR = ".nav-menu-user__link--hello"
const LOGIN_DONE_TEXT = "Olá"
const POLL_INTERVAL_MS = 2000
const LOGIN_TIMEOUT_MS = 5 * 60 * 1000

const reset = "\x1b[0m"
const cyan = "\x1b[38;2;80;200;240m"
const gray = "\x1b[38;2;140;140;140m"

async function waitForUserLogin(page: import("puppeteer").Page): Promise<void> {
    logInfo("Faça login no Mercado Livre. Aguardando detecção (timeout: 5 min)...")

    const deadline = Date.now() + LOGIN_TIMEOUT_MS

    while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))

        try {
            const text: string = await page.$eval(LOGIN_INDICATOR_SELECTOR, (el) => el.textContent ?? "")
            if (text.includes(LOGIN_DONE_TEXT)) return
        } catch {
            // empty
        }
    }

    throw new Error("Timeout aguardando login no Mercado Livre (5 min).")
}

export async function collectCookiesViaBrowser(): Promise<Cookie[]> {
    logInfo("Abrindo navegador para login no Mercado Livre...")

    const puppeteer = createStealthBrowser()

    const instance = await puppeteer.launch({
        headless: false,
        executablePath: getBrowserExecutablePath(),
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
        defaultViewport: null,
    })

    try {
        const page = await instance.newPage()
        await page.goto(ML_URL, { waitUntil: "domcontentloaded" })
        await waitForUserLogin(page)
        logSuccess("Login detectado! Coletando cookies...")
        return (await instance.cookies()) as unknown as Cookie[]
    } finally {
        await instance.close()
    }
}

export function collectCookiesViaExtension(): Cookie[] {
    console.log(`
  ${gray}Instale a extensão abaixo no Chrome para exportar os cookies:${reset}
  ${cyan}${EXTENSION_URL}${reset}

  ${gray}Passos:${reset}
    1. Acesse ${cyan}mercadolivre.com.br${reset} e faça login normalmente
    2. Clique no ícone da extensão
    3. Clique em "Export cookies" — um arquivo JSON será baixado
    4. Abra o arquivo, copie todo o conteúdo e cole abaixo (suporta múltiplas linhas)
`)

    let buffer = ""
    while (true) {
        const line = readlineSync.question(buffer ? "" : "  Cole o JSON aqui: ", { keepWhitespace: true })
        buffer += (buffer ? "\n" : "") + line

        const trimmed = buffer.trim()
        if (!trimmed) continue

        try {
            const parsed = JSON.parse(trimmed)
            if (!Array.isArray(parsed)) {
                throw new Error("Esperado um array de cookies (JSON deve iniciar com '[' e terminar com ']').")
            }
            return parsed as Cookie[]
        } catch (err: any) {
            if (line.trim() === "" && buffer.trim().length > 0) {
                throw new Error(`JSON inválido: ${err.message}`)
            }
        }
    }
}
