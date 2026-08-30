import { Command } from "commander"

import { loadConfig, updateConfig } from "../../helpers/config.helper"
import { logError, logInfo, logSuccess, logWarning } from "../../helpers/logger.helper"

// ─── Command ──────────────────────────────────────────────────────────────────

export const configAliExpressCommand = new Command("aliexpress")
    .alias("ali")
    .description("Configura as credenciais para o AliExpress Open Platform Afiliados")
    .requiredOption("-k, --app-key <appKey>", "App Key do AliExpress Open Platform")
    .requiredOption("-s, --app-secret <appSecret>", "App Secret do AliExpress Open Platform")
    .requiredOption("-t, --tracking-id <trackingId>", "Tracking ID para rastreamento de vendas")
    .action((opts) => {
        const config = loadConfig()

        if (config.aliexpress) {
            logWarning(`AliExpress já está configurado (App Key: ${config.aliexpress.appKey}). Sobrescrevendo...`)
        }

        updateConfig({
            aliexpress: {
                appKey: opts.appKey as string,
                appSecret: opts.appSecret as string,
                trackingId: opts.trackingId as string,
            },
        })

        logSuccess(`Configuração do AliExpress salva!`)
        logInfo(`App Key: ${opts.appKey}`)
        logInfo(`Tracking ID: ${opts.trackingId}`)
    })
