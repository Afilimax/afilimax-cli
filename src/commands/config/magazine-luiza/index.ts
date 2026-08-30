import { Command } from "commander"

import { runMagazineLuizaConfig } from "./action"

export const configMagazineLuizaCommand = new Command("magazine-luiza")
    .alias("magalu")
    .alias("mgl")
    .description("Configura as credenciais para o Magazine Luiza (Parceiro Magalu)")
    .action(runMagazineLuizaConfig)
