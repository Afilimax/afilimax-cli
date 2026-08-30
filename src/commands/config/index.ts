import { Command } from "commander"

import { configAliExpressCommand } from "./aliexpress"
import { configAmazonCommand } from "./amazon/index"
import { configMagazineLuizaCommand } from "./magazine-luiza/index"
import { configMercadoLivreCommand } from "./mercado-livre/index"
import { configShopeeCommand } from "./shopee"
import { configShowCommand } from "./show"

export const configCommand = new Command("config")
    .description("Configura as credenciais das plataformas de afiliados")
    .addCommand(configShowCommand)
    .addCommand(configAmazonCommand)
    .addCommand(configMercadoLivreCommand)
    .addCommand(configShopeeCommand)
    .addCommand(configAliExpressCommand)
    .addCommand(configMagazineLuizaCommand)
