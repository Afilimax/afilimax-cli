import { Command } from "commander"

import { subCommand } from "./subcommand"

export const exampleCommand = new Command("example")
    .alias("ex")
    .description("Comando de exemplo")
    .addCommand(subCommand)
    .action(() => {
        console.log("Executando o comando de exemplo")
    })
