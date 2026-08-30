import { AliExpressProvider } from "@afilimax/aliexpress-provider"
import { AmazonBrowserProvider } from "@afilimax/amazon-browser-provider"
import { MercadoLivreProvider } from "@afilimax/mercado-livre-provider"
import { ShopeeProvider } from "@afilimax/shopee-provider"
import { Command } from "commander"

import { areCookiesValid, getCookiesEarliestExpiry, loadConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess } from "../../helpers/logger.helper"
import { createAliExpressCommand } from "./aliexpress"
import { createAmazonCommand } from "./amazon"
import { createMercadoLivreCommand } from "./mercado-livre"
import { createShopeeCommand } from "./shopee"

// ─── Domain Detection ─────────────────────────────────────────────────────────

type Platform = "amazon" | "mercadoLivre" | "shopee" | "aliexpress"

const platformDomains: Record<Platform, string[]> = {
    amazon: ["amazon.com.br", "a.co", "amzn.to"],
    mercadoLivre: ["mercadolivre.com.br", "mercadolibre.com", "meli.la"],
    shopee: ["shopee.com.br", "shopee.com", "sho.pe", "shp.ee"],
    aliexpress: ["aliexpress.com"],
}

function detectPlatform(url: string): Platform | null {
    try {
        const hostname = new URL(url).hostname.toLowerCase()

        for (const [platform, domains] of Object.entries(platformDomains) as [Platform, string[]][]) {
            if (domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
                return platform
            }
        }
    } catch {
        // invalid URL — will be handled downstream
    }

    return null
}

// ─── Auto-detect Action ───────────────────────────────────────────────────────

async function autoCreateAffiliateUrl(url: string): Promise<void> {
    const platform = detectPlatform(url)

    if (!platform) {
        logError(
            `Não foi possível detectar a plataforma para: ${url}\n  Tente: afilimax create amazon|mercado-livre|shopee|aliexpress <url>`,
        )
        process.exit(1)
    }

    const config = loadConfig()
    logInfo(`Plataforma detectada: ${platform}`)

    switch (platform) {
        case "amazon": {
            if (!config.amazon?.cookies?.length) {
                logError("Amazon não configurado. Execute: afilimax config amazon")
                process.exit(1)
            }
            if (!areCookiesValid(config.amazon.cookies)) {
                const expiry = getCookiesEarliestExpiry(config.amazon.cookies)
                logError(
                    `Cookies da Amazon expirados${expiry ? ` (desde ${expiry.toLocaleDateString("pt-BR")})` : ""}. Execute: afilimax config amazon`,
                )
                process.exit(1)
            }
            logInfo("Gerando link Amazon via SiteStripe...")
            const amazonProvider = new AmazonBrowserProvider({
                cookies: config.amazon.cookies,
                puppeteer: { headless: true },
            })
            const amazonUrl = await amazonProvider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${amazonUrl}\n`)
            break
        }

        case "mercadoLivre": {
            if (!config.mercadoLivre?.cookies?.length) {
                logError("Mercado Livre não configurado. Execute: afilimax config mercado-livre")
                process.exit(1)
            }
            if (!areCookiesValid(config.mercadoLivre.cookies)) {
                const expiry = getCookiesEarliestExpiry(config.mercadoLivre.cookies)
                logError(
                    `Cookies do Mercado Livre expirados${expiry ? ` (desde ${expiry.toLocaleDateString("pt-BR")})` : ""}. Execute: afilimax config mercado-livre`,
                )
                process.exit(1)
            }
            logInfo("Gerando link Mercado Livre...")
            const mlProvider = new MercadoLivreProvider({
                tag: config.mercadoLivre.tag,
                cookies: config.mercadoLivre.cookies,
            })
            const mlUrl = await mlProvider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${mlUrl}\n`)
            break
        }

        case "shopee": {
            if (!config.shopee?.appId || !config.shopee?.appSecret) {
                logError("Shopee não configurado. Execute: afilimax config shopee --app-id ... --app-secret ...")
                process.exit(1)
            }
            logInfo("Gerando link Shopee...")
            const shopeeProvider = new ShopeeProvider({
                appId: config.shopee.appId,
                appSecret: config.shopee.appSecret,
                subIds: config.shopee.subIds ?? [],
            })
            const shopeeUrl = await shopeeProvider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${shopeeUrl}\n`)
            break
        }

        case "aliexpress": {
            if (!config.aliexpress?.appKey || !config.aliexpress?.appSecret || !config.aliexpress?.trackingId) {
                logError(
                    "AliExpress não configurado. Execute: afilimax config aliexpress --app-key ... --app-secret ... --tracking-id ...",
                )
                process.exit(1)
            }
            logInfo("Gerando link AliExpress...")
            const aliProvider = new AliExpressProvider({
                appKey: config.aliexpress.appKey,
                appSecret: config.aliexpress.appSecret,
                trackingId: config.aliexpress.trackingId,
            })
            const aliUrl = await aliProvider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${aliUrl}\n`)
            break
        }
    }
}

// ─── Command ──────────────────────────────────────────────────────────────────

export const createCommand = new Command("create")
    .description("Gera um link de afiliado. Detecta a plataforma automaticamente, ou use um subcomando específico.")
    .argument("[url]", "URL do produto (Amazon, Mercado Livre, Shopee ou AliExpress)")
    .action(async (url?: string) => {
        if (!url) {
            createCommand.help()
            return
        }

        try {
            await autoCreateAffiliateUrl(url)
        } catch (err) {
            logError("Erro inesperado ao gerar link", err)
            process.exit(1)
        }
    })
    .addCommand(createAmazonCommand)
    .addCommand(createMercadoLivreCommand)
    .addCommand(createShopeeCommand)
    .addCommand(createAliExpressCommand)
