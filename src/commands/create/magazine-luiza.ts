import { MagazineLuizaProvider } from "@afilimax/magazine-luiza-provider"
import { Command } from "commander"

import { areCookiesValid, getCookiesEarliestExpiry, loadConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess } from "../../helpers/logger.helper"

export const createMagazineLuizaCommand = new Command("magazine-luiza")
    .alias("magalu")
    .alias("mlz")
    .alias("luiza")
    .description("Gera um link de afiliado para o Magazine Luiza")
    .argument("<url>", "URL do produto no Magazine Luiza")
    .action(async (url: string) => {
        const config = loadConfig()

        if (!config.magazineLuiza?.cookies || config.magazineLuiza.cookies.length === 0) {
            logError("Magazine Luiza não configurado. Execute: afilimax config magazine-luiza")
            process.exit(1)
        }

        if (!areCookiesValid(config.magazineLuiza.cookies)) {
            const expiry = getCookiesEarliestExpiry(config.magazineLuiza.cookies)
            logError(
                `Os cookies do Magazine Luiza estão expirados${expiry ? ` (desde ${expiry.toLocaleDateString("pt-BR")})` : ""}. Execute: afilimax config magazine-luiza`,
            )
            process.exit(1)
        }

        logInfo("Gerando link de afiliado Magazine Luiza...")

        try {
            const provider = new MagazineLuizaProvider({
                affiliateSlug: config.magazineLuiza.affiliateSlug,
                cookies: config.magazineLuiza.cookies as any,
            })

            const affiliateUrl = await provider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${affiliateUrl}\n`)
        } catch (err) {
            logError("Falha ao gerar link do Magazine Luiza", err)
            process.exit(1)
        }
    })
