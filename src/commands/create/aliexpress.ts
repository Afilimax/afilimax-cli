import { AliExpressProvider } from "@afilimax/aliexpress-provider"
import { Command } from "commander"

import { loadConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess } from "../../helpers/logger.helper"

export const createAliExpressCommand = new Command("aliexpress")
    .alias("ali")
    .description("Gera um link de afiliado para o AliExpress")
    .argument("<url>", "URL do produto no AliExpress")
    .action(async (url: string) => {
        const config = loadConfig()

        if (!config.aliexpress?.appKey || !config.aliexpress?.appSecret || !config.aliexpress?.trackingId) {
            logError(
                "AliExpress não configurado. Execute: afilimax config aliexpress --app-key ... --app-secret ... --tracking-id ...",
            )
            process.exit(1)
        }

        logInfo("Gerando link de afiliado AliExpress...")

        try {
            const provider = new AliExpressProvider({
                appKey: config.aliexpress.appKey,
                appSecret: config.aliexpress.appSecret,
                trackingId: config.aliexpress.trackingId,
            })

            const affiliateUrl = await provider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${affiliateUrl}\n`)
        } catch (err) {
            logError("Falha ao gerar link do AliExpress", err)
            process.exit(1)
        }
    })
