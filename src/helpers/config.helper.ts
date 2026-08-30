import fs from "node:fs"
import os from "node:os"
import path from "node:path"

// ─── Types ────────────────────────────────────────────────────────────────────

export type Cookie = {
    name: string
    value: string
    domain?: string
    expires?: number // Unix timestamp (seconds)
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

export type AfilimaxConfig = {
    amazon?: AmazonConfig
    mercadoLivre?: MercadoLivreConfig
    shopee?: ShopeeConfig
    aliexpress?: AliExpressConfig
}

// ─── Config File Path ─────────────────────────────────────────────────────────

const configDir = path.join(os.homedir(), ".afilimax")
const configFilePath = path.join(configDir, "config.json")

// ─── Core Functions ───────────────────────────────────────────────────────────

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

// ─── Cookie Validation ────────────────────────────────────────────────────────

/**
 * Checks whether any cookie in the array is expired.
 * Returns true if all cookies with expiry dates are still valid (or have no expiry).
 */
export function areCookiesValid(cookies: Cookie[]): boolean {
    if (!cookies || cookies.length === 0) return false

    const now = Math.floor(Date.now() / 1000) // current time in seconds

    for (const cookie of cookies) {
        // Some cookie formats use -1 or 0 to represent "session cookie" (no expiry)
        if (cookie.expires !== undefined && cookie.expires > 0 && cookie.expires < now) {
            return false
        }
    }

    return true
}

/**
 * Returns the earliest expiry date of all cookies that have one, or null.
 */
export function getCookiesEarliestExpiry(cookies: Cookie[]): Date | null {
    const expiryTimestamps = cookies.map((c) => c.expires).filter((e): e is number => typeof e === "number" && e > 0)

    if (expiryTimestamps.length === 0) return null

    return new Date(Math.min(...expiryTimestamps) * 1000)
}
