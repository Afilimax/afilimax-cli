import { Command } from "commander"

import { loadConfig, updateConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess, logWarning } from "../../helpers/logger.helper"

// ─── Command ──────────────────────────────────────────────────────────────────

export const configShopeeCommand = new Command("shopee")
    .alias("sh")
    .description("Configura as credenciais para o Shopee Afiliados")
    .requiredOption("-i, --app-id <appId>", "App ID do portal de Afiliados da Shopee")
    .requiredOption("-s, --app-secret <appSecret>", "App Secret do portal de Afiliados da Shopee")
    .option("-u, --sub-ids <subIds...>", "Sub IDs para rastreamento interno (máximo 5, separados por espaço)")
    .action((opts) => {
        const config = loadConfig()

        if (config.shopee) {
            logWarning(`Shopee já está configurado (App ID: ${config.shopee.appId}). Sobrescrevendo...`)
        }

        const subIds = opts.subIds ? (opts.subIds as string[]).slice(0, 5) : []

        updateConfig({
            shopee: {
                appId: opts.appId as string,
                appSecret: opts.appSecret as string,
                subIds,
            },
        })

        logSuccess(`Configuração da Shopee salva!`)
        logInfo(`App ID: ${opts.appId}`)
        if (subIds.length > 0) logInfo(`Sub IDs: ${subIds.join(", ")}`)
    })
