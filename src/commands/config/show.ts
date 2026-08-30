import { Command } from "commander"

import { areCookiesValid, getCookiesEarliestExpiry, loadConfig } from "../../helpers/config.helper"
import { logCard, logJson } from "../../helpers/logger.helper"

function maskSecret(secret?: string): string {
    if (!secret) return "(não definido)"
    if (secret.length <= 4) return "****"
    return `${secret.slice(0, 3)}****${secret.slice(-3)}`
}

export const configShowCommand = new Command("show")
    .alias("ls")
    .description("Exibe a configuração atual de todas as plataformas de afiliados")
    .option("--json", "Exibe a configuração em formato JSON")
    .action((opts) => {
        const config = loadConfig()

        if (opts.json) {
            logJson(config)
            return
        }

        if (config.amazon?.cookies && config.amazon.cookies.length > 0) {
            const isValid = areCookiesValid(config.amazon.cookies)
            const expiry = getCookiesEarliestExpiry(config.amazon.cookies)
            logCard("Amazon Associados", {
                Status: isValid ? "Configurado (Válido)" : "Configurado (Cookies expirados)",
                Cookies: `${config.amazon.cookies.length} cookie(s)`,
                Expiração: expiry ? expiry.toLocaleDateString("pt-BR") : "Desconhecida",
            })
        } else {
            logCard("Amazon Associados", {
                Status: "Não configurado",
            })
        }

        if (config.mercadoLivre?.cookies && config.mercadoLivre.cookies.length > 0) {
            const isValid = areCookiesValid(config.mercadoLivre.cookies)
            const expiry = getCookiesEarliestExpiry(config.mercadoLivre.cookies)
            logCard("Mercado Livre Afiliados", {
                Status: isValid ? "Configurado (Válido)" : "Configurado (Cookies expirados)",
                Tag: config.mercadoLivre.tag,
                Cookies: `${config.mercadoLivre.cookies.length} cookie(s)`,
                Expiração: expiry ? expiry.toLocaleDateString("pt-BR") : "Desconhecida",
            })
        } else {
            logCard("Mercado Livre Afiliados", {
                Status: "Não configurado",
            })
        }

        if (config.shopee) {
            const subIds = config.shopee.subIds ?? []
            logCard("Shopee Afiliados", {
                Status: "Configurado",
                "App ID": config.shopee.appId,
                "App Secret": maskSecret(config.shopee.appSecret),
                "Sub IDs": subIds.length > 0 ? subIds.join(", ") : "(nenhum)",
            })
        } else {
            logCard("Shopee Afiliados", {
                Status: "Não configurado",
            })
        }

        if (config.aliexpress) {
            logCard("AliExpress Open Platform", {
                Status: "Configurado",
                "App Key": config.aliexpress.appKey,
                "App Secret": maskSecret(config.aliexpress.appSecret),
                "Tracking ID": config.aliexpress.trackingId,
            })
        } else {
            logCard("AliExpress Open Platform", {
                Status: "Não configurado",
            })
        }

        if (config.magazineLuiza?.cookies && config.magazineLuiza.cookies.length > 0) {
            const isValid = areCookiesValid(config.magazineLuiza.cookies)
            const expiry = getCookiesEarliestExpiry(config.magazineLuiza.cookies)
            logCard("Magazine Luiza (Influenciador Magalu)", {
                Status: isValid ? "Configurado (Válido)" : "Configurado (Cookies expirados)",
                "Slug Afiliado": config.magazineLuiza.affiliateSlug,
                Cookies: `${config.magazineLuiza.cookies.length} cookie(s)`,
                Expiração: expiry ? expiry.toLocaleDateString("pt-BR") : "Desconhecida",
            })
        } else {
            logCard("Magazine Luiza (Parceiro Magalu)", {
                Status: "Não configurado",
            })
        }
    })
