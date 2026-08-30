import { Command } from "commander"

import { runAmazonConfig } from "./action"

export const configAmazonCommand = new Command("amazon")
    .alias("amz")
    .description("Configura as credenciais (cookies) para o Amazon Associates")
    .action(runAmazonConfig)
