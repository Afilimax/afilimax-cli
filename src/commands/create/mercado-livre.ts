import { MercadoLivreProvider } from "@afilimax/mercado-livre-provider"
import { Command } from "commander"

import { areCookiesValid, getCookiesEarliestExpiry, loadConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess } from "../../helpers/logger.helper"

export const createMercadoLivreCommand = new Command("mercado-livre")
    .alias("ml")
    .description("Gera um link de afiliado para o Mercado Livre")
    .argument("<url>", "URL do produto no Mercado Livre")
    .action(async (url: string) => {
        const config = loadConfig()

        if (!config.mercadoLivre?.cookies || config.mercadoLivre.cookies.length === 0) {
            logError("Mercado Livre não configurado. Execute: afilimax config mercado-livre")
            process.exit(1)
        }

        if (!areCookiesValid(config.mercadoLivre.cookies)) {
            const expiry = getCookiesEarliestExpiry(config.mercadoLivre.cookies)
            logError(
                `Os cookies do Mercado Livre estão expirados${expiry ? ` (desde ${expiry.toLocaleDateString("pt-BR")})` : ""}. Execute: afilimax config mercado-livre`,
            )
            process.exit(1)
        }

        logInfo("Gerando link de afiliado Mercado Livre...")

        try {
            const provider = new MercadoLivreProvider({
                tag: config.mercadoLivre.tag,
                cookies: config.mercadoLivre.cookies,
            })

            const affiliateUrl = await provider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${affiliateUrl}\n`)
        } catch (err) {
            logError("Falha ao gerar link do Mercado Livre", err)
            process.exit(1)
        }
    })
