import readlineSync from "readline-sync"

import { Cookie } from "../../../helpers/config.helper"
import { logInfo, logSuccess } from "../../../helpers/logger.helper"
import { createStealthBrowser, getBrowserExecutablePath } from "../../../helpers/puppeteer.helper"

const MAGALU_URL = "https://www.magazinevoce.com.br/admin"
const EXTENSION_URL =
    "https://chromewebstore.google.com/detail/export-cookie-json-file-f/nmckokihipjgplolmcmjakknndddifde"

const reset = "\x1b[0m"
const cyan = "\x1b[38;2;80;200;240m"
const gray = "\x1b[38;2;140;140;140m"

export async function collectCookiesViaBrowser(): Promise<Cookie[]> {
    logInfo("Abrindo navegador para login no Magazine Luiza...")

    const puppeteer = createStealthBrowser()

    const instance = await puppeteer.launch({
        headless: false,
        executablePath: getBrowserExecutablePath(),
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
        defaultViewport: null,
    })

    try {
        const page = await instance.newPage()
        await page.goto(MAGALU_URL, { waitUntil: "domcontentloaded" })
        logInfo("Faça login no Magazine Luiza / Parceiro Magalu na janela do navegador.")
        readlineSync.question("  Pressione Enter no terminal quando tiver concluído o login... ")
        logSuccess("Coletando cookies do navegador...")
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
    1. Acesse ${cyan}magazineluiza.com.br${reset} (ou seu portal Parceiro Magalu) e faça login
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
