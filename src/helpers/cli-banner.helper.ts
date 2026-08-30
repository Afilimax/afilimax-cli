import { author, name, version } from "../../package.json"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const white = "\x1b[38;2;255;255;255m"
const cyan = "\x1b[38;2;70;190;250m"
const gray = "\x1b[38;2;140;140;140m"
const gold = "\x1b[38;2;255;200;0m"

function stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, "")
}

function makeBoxLine(content: string, width = 84): string {
    const visibleLength = stripAnsi(content).replace(/[\u{1F300}-\u{1F9FF}]/gu, "  ").length
    const padding = Math.max(0, width - visibleLength)
    return `${gray}│${reset} ${content}${" ".repeat(padding)} ${gray}│${reset}`
}

function colorizeMaxGradient(text: string): string {
    const len = text.length
    if (len === 0) return ""
    let result = ""
    for (let i = 0; i < len; i++) {
        const char = text[i]
        if (char === " ") {
            result += " "
            continue
        }
        const t = len > 1 ? i / (len - 1) : 0
        let r: number, g: number, b: number
        if (t <= 0.5) {
            const t2 = t / 0.5
            // Smooth transition: Pink/Magenta (245, 75, 160) -> Violet/Purple (165, 70, 230)
            r = Math.round(245 + t2 * (165 - 245))
            g = Math.round(75 + t2 * (70 - 75))
            b = Math.round(160 + t2 * (230 - 160))
        } else {
            const t2 = (t - 0.5) / 0.5
            // Smooth transition: Violet/Purple (165, 70, 230) -> Dark Indigo/Purple (95, 50, 225)
            r = Math.round(165 + t2 * (95 - 165))
            g = Math.round(70 + t2 * (50 - 70))
            b = Math.round(230 + t2 * (225 - 230))
        }
        result += `\x1b[38;2;${r};${g};${b}m${char}`
    }
    return result + reset
}

const boxWidth = 84

const topBorder = `${gray}╭${"─".repeat(boxWidth + 2)}╮${reset}`
const emptyLine = `${gray}│${" ".repeat(boxWidth + 2)}│${reset}`
const bottomBorder = `${gray}╰${"─".repeat(boxWidth + 2)}╯${reset}`

const maxArtLine1 = "███╗   ███╗ █████╗ ██╗  ██╗"
const maxArtLine2 = "████╗ ████║██╔══██╗╚██╗██╔╝"
const maxArtLine3 = "██╔████╔██║███████║ ╚███╔╝ "
const maxArtLine4 = "██║╚██╔╝██║██╔══██║ ██╔██╗ "
const maxArtLine5 = "██║ ╚═╝ ██║██║  ██║██╔╝ ██╗"
const maxArtLine6 = "╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝"

const bannerLine1 = makeBoxLine(
    `${bold}${white} █████╗ ███████╗██╗██╗     ██╗${reset}${bold}${colorizeMaxGradient(maxArtLine1)}${bold}${cyan}     ██████╗██╗     ██╗${reset}`,
    boxWidth,
)
const bannerLine2 = makeBoxLine(
    `${bold}${white}██╔══██╗██╔════╝██║██║     ██║${reset}${bold}${colorizeMaxGradient(maxArtLine2)}${bold}${cyan}    ██╔════╝██║     ██║${reset}`,
    boxWidth,
)
const bannerLine3 = makeBoxLine(
    `${bold}${white}███████║█████╗  ██║██║     ██║${reset}${bold}${colorizeMaxGradient(maxArtLine3)}${bold}${cyan}    ██║     ██║     ██║${reset}`,
    boxWidth,
)
const bannerLine4 = makeBoxLine(
    `${bold}${white}██╔══██║██╔══╝  ██║██║     ██║${reset}${bold}${colorizeMaxGradient(maxArtLine4)}${bold}${cyan}    ██║     ██║     ██║${reset}`,
    boxWidth,
)
const bannerLine5 = makeBoxLine(
    `${bold}${white}██║  ██║██║     ██║███████╗██║${reset}${bold}${colorizeMaxGradient(maxArtLine5)}${bold}${cyan}    ╚██████╗███████╗██║${reset}`,
    boxWidth,
)
const bannerLine6 = makeBoxLine(
    `${bold}${white}╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝${reset}${bold}${colorizeMaxGradient(maxArtLine6)}${bold}${cyan}     ╚═════╝╚══════╝╚═╝${reset}`,
    boxWidth,
)

const sloganLine = makeBoxLine(`                            ${gray}${bold}https://afilimax.net${reset}`, boxWidth)

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
${sloganLine}
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
