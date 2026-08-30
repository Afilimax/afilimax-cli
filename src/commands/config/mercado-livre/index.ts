import { Command } from "commander"

import { runMercadoLivreConfig } from "./action"

export const configMercadoLivreCommand = new Command("mercado-livre")
    .alias("ml")
    .description("Configura as credenciais (tag + cookies) para o Mercado Livre Afiliados")
    .action(runMercadoLivreConfig)
