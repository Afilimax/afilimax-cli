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

function makeBoxLine(content: string, width = 84): string {
    const visibleLength = stripAnsi(content).replace(/[\u{1F300}-\u{1F9FF}]/gu, "  ").length
    const padding = Math.max(0, width - visibleLength)
    return `${gray}│${reset} ${content}${" ".repeat(padding)} ${gray}│${reset}`
}

const boxWidth = 84

const topBorder = `${gray}╭${"─".repeat(boxWidth + 2)}╮${reset}`
const emptyLine = `${gray}│${" ".repeat(boxWidth + 2)}│${reset}`
const bottomBorder = `${gray}╰${"─".repeat(boxWidth + 2)}╯${reset}`

const bannerLine1 = makeBoxLine(
    `${orange}${bold} █████╗ ███████╗██╗██╗     ██╗███╗   ███╗ █████╗ ██╗  ██╗     ██████╗██╗     ██╗${reset}`,
    boxWidth,
)
const bannerLine2 = makeBoxLine(
    `${orange}${bold}██╔══██╗██╔════╝██║██║     ██║████╗ ████║██╔══██╗╚██╗██╔╝    ██╔════╝██║     ██║${reset}`,
    boxWidth,
)
const bannerLine3 = makeBoxLine(
    `${orange}${bold}███████║█████╗  ██║██║     ██║██╔████╔██║███████║ ╚███╔╝     ██║     ██║     ██║${reset}`,
    boxWidth,
)
const bannerLine4 = makeBoxLine(
    `${orange}${bold}██╔══██║██╔══╝  ██║██║     ██║██║╚██╔╝██║██╔══██║ ██╔██╗     ██║     ██║     ██║${reset}`,
    boxWidth,
)
const bannerLine5 = makeBoxLine(
    `${orange}${bold}██║  ██║██║     ██║███████╗██║██║ ╚═╝ ██║██║  ██║██╔╝ ██╗    ╚██████╗███████╗██║${reset}`,
    boxWidth,
)
const bannerLine6 = makeBoxLine(
    `${orange}${bold}╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝╚══════╝╚═╝${reset}`,
    boxWidth,
)

const subLine = makeBoxLine(
    `  ${bold}by ${author.toUpperCase()}${reset} ${gold}v${version}${reset} ${gray}•${reset} ${cyan}${name}${reset}`,
    boxWidth,
)

const repoLine = makeBoxLine(
    `  ${gray}Repo     :${reset} ${cyan}https://github.com/Afilimax/afilimax-cli${reset}`,
    boxWidth,
)
const releasesLine = makeBoxLine(
    `  ${gray}Releases :${reset} ${cyan}https://github.com/Afilimax/afilimax-cli/releases${reset}`,
    boxWidth,
)
const issuesLine = makeBoxLine(
    `  ${gray}Issues   :${reset} ${cyan}https://github.com/Afilimax/afilimax-cli/issues${reset}`,
    boxWidth,
)

export const cliBanner = `
${topBorder}
${emptyLine}
${bannerLine1}
${bannerLine2}
${bannerLine3}
${bannerLine4}
${bannerLine5}
${bannerLine6}
${emptyLine}
${subLine}
${emptyLine}
${repoLine}
${releasesLine}
${issuesLine}
${emptyLine}
${bottomBorder}
`

export function showBanner(): void {
    console.log(cliBanner)
}
