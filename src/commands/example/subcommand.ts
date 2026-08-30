import { Command } from "commander"

export const subCommand = new Command("subcommand")
    .alias("sub")
    .description("Subcomando de exemplo")
    .action(() => {
        console.log("Executando o subcomando de exemplo")
    })
