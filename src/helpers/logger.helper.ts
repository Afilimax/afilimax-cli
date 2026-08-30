import readline from "node:readline"

import winston from "winston"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const cyan = "\x1b[38;2;80;200;240m"
const gold = "\x1b[38;2;255;200;0m"
const gray = "\x1b[38;2;140;140;140m"
const green = "\x1b[38;2;80;200;120m"

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
            if (stack) {
                return `[${timestamp}] ${level}: ${message}\n${stack}`
            }
            return `[${timestamp}] ${level}: ${message}`
        }),
    ),
    transports: [new winston.transports.Console()],
})

export function logSuccess(message: string): void {
    logger.info(`✔ ${message}`)
}

export function logInfo(message: string): void {
    logger.info(`ℹ ${message}`)
}

export function logWarning(message: string): void {
    logger.warn(`⚠ ${message}`)
}

export function logError(message: string, error?: unknown): void {
    if (error instanceof Error) {
        logger.error(`✖ ${message}`, { stack: error.stack })
    } else if (error) {
        logger.error(`✖ ${message} - ${String(error)}`)
    } else {
        logger.error(`✖ ${message}`)
    }
}

export function logJson(data: unknown): void {
    console.log(JSON.stringify(data, null, 2))
}

export function formatExtractedMetadata(data: Record<string, unknown>): Record<string, unknown> {
    const formatted: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined || String(value).trim() === "") {
            formatted[key] = "(none)"
        } else {
            formatted[key] = value
        }
    }

    return formatted
}

export function logCard(title: string, records: Record<string, unknown>): void {
    console.log(`\n  ${bold}${gold}📌 ${title}${reset}`)
    const entries = Object.entries(records).filter(([_, v]) => v !== undefined)
    const maxKeyLen = Math.max(...entries.map(([k]) => k.length), 0)

    for (const [key, value] of entries) {
        const paddedKey = key.padEnd(maxKeyLen)
        console.log(`     ${gray}${paddedKey}${reset} : ${green}${String(value)}${reset}`)
    }

    console.log()
}

export async function logSearchResults(
    query: string,
    keyMatches: Array<{ key: string; value?: string }>,
    valueMatches: Array<{ value: string; key?: string }>,
    pageSize = 12,
): Promise<void> {
    const isInteractive = Boolean(process.stdout.isTTY && process.stdin.isTTY)

    if (keyMatches.length === 0 && valueMatches.length === 0) {
        console.log(`\n  ${gray}No matches found for "${query}".${reset}\n`)
        return
    }

    const totalItems = keyMatches.length + valueMatches.length
    const totalPages = Math.ceil(totalItems / pageSize)

    if (!isInteractive || totalPages <= 1) {
        console.log(
            `\n  ${bold}${gold}🔍 Search Results for "${query}"${reset} ${gray}(${keyMatches.length} matching keys, ${valueMatches.length} matching values)${reset}\n`,
        )

        const limit = pageSize
        if (keyMatches.length > 0) {
            console.log(`  ${bold}${cyan}🔑 Matching Keys:${reset}`)
            for (const item of keyMatches.slice(0, limit)) {
                const valStr = item.value ? ` ➔ ${green}"${item.value}"${reset}` : ""
                console.log(`    ${gray}•${reset} ${bold}${item.key}${reset}${valStr}`)
            }
            if (keyMatches.length > limit) {
                console.log(
                    `    ${gray}... and ${keyMatches.length - limit} more matching keys. (Use interactive terminal or -o to save full output)${reset}`,
                )
            }
            console.log()
        }

        if (valueMatches.length > 0) {
            console.log(`  ${bold}${cyan}💬 Matching Values:${reset}`)
            for (const item of valueMatches.slice(0, limit)) {
                const keyStr = item.key ? `${bold}${item.key}${reset} ➔ ` : ""
                console.log(`    ${gray}•${reset} ${keyStr}${green}"${item.value}"${reset}`)
            }

            if (valueMatches.length > limit) {
                console.log(
                    `    ${gray}... and ${valueMatches.length - limit} more matching values. (Use interactive terminal or -o to save full output)${reset}`,
                )
            }

            console.log()
        }
        return
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const askQuestion = (queryText: string): Promise<string> =>
        new Promise((resolve) => rl.question(queryText, resolve))

    let currentPage = 1

    try {
        while (true) {
            console.log(
                `\n  ${bold}${gold}🔍 Search Results for "${query}"${reset} ${gray}(Page ${currentPage}/${totalPages} • ${keyMatches.length} keys, ${valueMatches.length} values)${reset}\n`,
            )

            const startIndex = (currentPage - 1) * pageSize
            const endIndex = startIndex + pageSize

            let currentItemsRemaining = pageSize
            const keyStartIndex = Math.min(keyMatches.length, startIndex)
            const keyEndIndex = Math.min(keyMatches.length, endIndex)
            const pageKeyItems = keyMatches.slice(keyStartIndex, keyEndIndex)

            currentItemsRemaining -= pageKeyItems.length

            const valStartIndex = Math.max(0, startIndex - keyMatches.length)
            const valEndIndex = Math.min(valueMatches.length, valStartIndex + currentItemsRemaining)
            const pageValItems = valueMatches.slice(valStartIndex, valEndIndex)

            if (pageKeyItems.length > 0) {
                console.log(`  ${bold}${cyan}🔑 Matching Keys:${reset}`)
                for (const item of pageKeyItems) {
                    const valStr = item.value ? ` ➔ ${green}"${item.value}"${reset}` : ""
                    console.log(`    ${gray}•${reset} ${bold}${item.key}${reset}${valStr}`)
                }
                console.log()
            }

            if (pageValItems.length > 0) {
                console.log(`  ${bold}${cyan}💬 Matching Values:${reset}`)
                for (const item of pageValItems) {
                    const keyStr = item.key ? `${bold}${item.key}${reset} ➔ ` : ""
                    console.log(`    ${gray}•${reset} ${keyStr}${green}"${item.value}"${reset}`)
                }
                console.log()
            }

            const prompt = `  ${gray}Page ${currentPage}/${totalPages} [Press Enter/'n': Next | 'p': Prev | 'q': Quit]: ${reset}`
            const answer = await askQuestion(prompt)
            const choice = answer.trim().toLowerCase()

            if (choice === "q" || choice === "exit") {
                break
            } else if (choice === "p" || choice === "b") {
                if (currentPage > 1) {
                    currentPage--
                } else {
                    console.log(`  ${gray}Already on the first page.${reset}`)
                }
            } else {
                if (currentPage < totalPages) {
                    currentPage++
                } else {
                    console.log(`  ${gray}Reached the end of search results.${reset}`)
                    break
                }
            }
        }
    } finally {
        rl.close()
    }
}
