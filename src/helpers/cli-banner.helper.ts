import { author, name, version } from "../../package.json"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const orange = "\x1b[38;2;255;140;0m"
const gold = "\x1b[38;2;255;200;0m"
const cyan = "\x1b[38;2;80;200;240m"
const gray = "\x1b[38;2;140;140;140m"

function stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, "")
}

function makeBoxLine(content: string, width = 68): string {
    const visibleLength = stripAnsi(content).replace(/[\u{1F300}-\u{1F9FF}]/gu, "  ").length
    const padding = Math.max(0, width - visibleLength)
    return `${gray}│${reset} ${content}${" ".repeat(padding)} ${gray}│${reset}`
}

const boxWidth = 72

const topBorder = `${gray}╭${"─".repeat(boxWidth + 2)}╮${reset}`
const emptyLine = `${gray}│${" ".repeat(boxWidth + 2)}│${reset}`
const bottomBorder = `${gray}╰${"─".repeat(boxWidth + 2)}╯${reset}`

const cliLine1 = makeBoxLine(`${orange}${bold}                          ██████╗ ██╗     ██╗${reset}`, boxWidth)
const cliLine2 = makeBoxLine(`${orange}${bold}                         ██╔════╝ ██║     ██║${reset}`, boxWidth)
const cliLine3 = makeBoxLine(`${orange}${bold}                         ██║      ██║     ██║${reset}`, boxWidth)
const cliLine4 = makeBoxLine(`${orange}${bold}                         ██║      ██║     ██║${reset}`, boxWidth)
const cliLine5 = makeBoxLine(`${orange}${bold}                         ╚██████╗ ███████╗██║${reset}`, boxWidth)
const cliLine6 = makeBoxLine(`${orange}${bold}                          ╚═════╝ ╚══════╝╚═╝${reset}`, boxWidth)

const templateLine1 = makeBoxLine(
    `${orange}${bold} ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗${reset}`,
    boxWidth,
)
const templateLine2 = makeBoxLine(
    `${orange}${bold} ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝${reset}`,
    boxWidth,
)
const templateLine3 = makeBoxLine(
    `${orange}${bold}    ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  ${reset}`,
    boxWidth,
)
const templateLine4 = makeBoxLine(
    `${orange}${bold}    ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ${reset}`,
    boxWidth,
)
const templateLine5 = makeBoxLine(
    `${orange}${bold}    ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗${reset}`,
    boxWidth,
)
const templateLine6 = makeBoxLine(
    `${orange}${bold}    ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝${reset}`,
    boxWidth,
)

const subLine = makeBoxLine(
    `  ${bold}by ${author.toUpperCase()}${reset} ${gold}v${version}${reset} ${gray}•${reset} ${cyan}${name}${reset}`,
    boxWidth,
)

export const cliBanner = `
${topBorder}
${emptyLine}
${cliLine1}
${cliLine2}
${cliLine3}
${cliLine4}
${cliLine5}
${cliLine6}
${emptyLine}
${templateLine1}
${templateLine2}
${templateLine3}
${templateLine4}
${templateLine5}
${templateLine6}
${emptyLine}
${subLine}
${emptyLine}
${bottomBorder}
`

export function showBanner(): void {
    console.log(cliBanner)
}
