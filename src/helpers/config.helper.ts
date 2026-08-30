import fs from "node:fs"
import os from "node:os"
import path from "node:path"

export type Cookie = {
    name: string
    value: string
    domain?: string
    expires?: number
    [key: string]: unknown
}

export type AmazonConfig = {
    cookies: Cookie[]
}

export type MercadoLivreConfig = {
    tag: string
    cookies: Cookie[]
}

export type ShopeeConfig = {
    appId: string
    appSecret: string
    subIds?: string[]
}

export type AliExpressConfig = {
    appKey: string
    appSecret: string
    trackingId: string
}

export type MagazineLuizaConfig = {
    affiliateSlug: string
    cookies: Cookie[]
}

export type AfilimaxConfig = {
    amazon?: AmazonConfig
    mercadoLivre?: MercadoLivreConfig
    shopee?: ShopeeConfig
    aliexpress?: AliExpressConfig
    magazineLuiza?: MagazineLuizaConfig
}

const configDir = path.join(os.homedir(), ".afilimax")
const configFilePath = path.join(configDir, "config.json")

export function loadConfig(): AfilimaxConfig {
    if (!fs.existsSync(configFilePath)) {
        return {}
    }

    try {
        const raw = fs.readFileSync(configFilePath, "utf-8")
        return JSON.parse(raw) as AfilimaxConfig
    } catch {
        return {}
    }
}

export function saveConfig(config: AfilimaxConfig): void {
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
    }

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf-8")
}

export function updateConfig(partial: Partial<AfilimaxConfig>): void {
    const current = loadConfig()
    const updated = { ...current, ...partial }
    saveConfig(updated)
}

export function areCookiesValid(cookies: Cookie[]): boolean {
    if (!cookies || cookies.length === 0) return false

    const now = Math.floor(Date.now() / 1000)

    for (const cookie of cookies) {
        if (cookie.expires !== undefined && cookie.expires > 0 && cookie.expires < now) {
            return false
        }
    }

    return true
}

export function getCookiesEarliestExpiry(cookies: Cookie[]): Date | null {
    const expiryTimestamps = cookies.map((c) => c.expires).filter((e): e is number => typeof e === "number" && e > 0)

    if (expiryTimestamps.length === 0) return null

    return new Date(Math.min(...expiryTimestamps) * 1000)
}
