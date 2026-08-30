import { Command } from "commander"

export const sumCommand = new Command("sum")
    .alias("add")
    .description("Comando para somar números")
    .argument("<numbers...>", "Números a serem somados")
    .action((numbers: string[]) => {
        const total = numbers.reduce((acc, current) => {
            const num = parseFloat(current)
            if (isNaN(num)) {
                console.error(`Erro: "${current}" não é um número válido.`)
                process.exit(1)
            }
            return acc + num
        }, 0)

        console.log(`Resultado da soma: ${total}`)
    })
