import { Command } from "commander"

import { description, name, version } from "../package.json"
import { exampleCommand, sumCommand } from "./commands/index"
import { cliBanner } from "./helpers/cli-banner.helper"

export function createProgram(): Command {
    const program = new Command()

    program.name(name).version(version).description(description).addHelpText("before", cliBanner)

    program.addCommand(exampleCommand)
    program.addCommand(sumCommand)

    return program
}

export function main(argv: string[] = process.argv): void {
    const program = createProgram()
    program.parse(argv)
}

if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
    main()
}
