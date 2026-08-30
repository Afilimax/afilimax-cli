import { AmazonBrowserProvider } from "@afilimax/amazon-browser-provider"
import { Command } from "commander"

import { areCookiesValid, getCookiesEarliestExpiry, loadConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess, logWarning } from "../../helpers/logger.helper"

export const createAmazonCommand = new Command("amazon")
    .alias("amz")
    .description("Gera um link de afiliado para a Amazon")
    .argument("<url>", "URL do produto na Amazon (amazon.com.br)")
    .action(async (url: string) => {
        const config = loadConfig()

        if (!config.amazon?.cookies || config.amazon.cookies.length === 0) {
            logError("Amazon não configurado. Execute: afilimax config amazon")
            process.exit(1)
        }

        if (!areCookiesValid(config.amazon.cookies, "amazon")) {
            const expiry = getCookiesEarliestExpiry(config.amazon.cookies, "amazon")
            logError(
                `Os cookies da Amazon estão expirados${expiry ? ` (desde ${expiry.toLocaleDateString("pt-BR")})` : ""}. Execute: afilimax config amazon`,
            )
            process.exit(1)
        }

        logInfo("Gerando link de afiliado Amazon via SiteStripe...")

        try {
            const provider = new AmazonBrowserProvider({
                cookies: config.amazon.cookies,
                puppeteer: { headless: true },
            })

            const affiliateUrl = await provider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${affiliateUrl}\n`)
        } catch (err) {
            logError("Falha ao gerar link da Amazon", err)
            process.exit(1)
        }
    })
