import { ShopeeProvider } from "@afilimax/shopee-provider"
import { Command } from "commander"

import { loadConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess } from "../../helpers/logger.helper"

export const createShopeeCommand = new Command("shopee")
    .alias("sh")
    .description("Gera um link de afiliado para a Shopee")
    .argument("<url>", "URL do produto na Shopee")
    .action(async (url: string) => {
        const config = loadConfig()

        if (!config.shopee?.appId || !config.shopee?.appSecret) {
            logError("Shopee não configurado. Execute: afilimax config shopee --app-id ... --app-secret ...")
            process.exit(1)
        }

        logInfo("Gerando link de afiliado Shopee...")

        try {
            const provider = new ShopeeProvider({
                appId: config.shopee.appId,
                appSecret: config.shopee.appSecret,
                subIds: config.shopee.subIds ?? [],
            })

            const affiliateUrl = await provider.createAffiliateUrl(url)
            logSuccess("Link gerado com sucesso!")
            console.log(`\n  🔗 ${affiliateUrl}\n`)
        } catch (err) {
            logError("Falha ao gerar link da Shopee", err)
            process.exit(1)
        }
    })
