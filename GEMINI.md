# GEMINI.md - Project Documentation & Guidelines

## 📌 Project Overview
**AfiliMax CLI** (`@afilimax/cli`) is a modern, modular TypeScript Command Line Interface (CLI) application for managing affiliate credentials and generating affiliate links across multiple e-commerce platforms: **Amazon Associates**, **Mercado Livre Afiliados**, **Shopee Afiliados**, and **AliExpress Open Platform**.

- **Author:** Marcuth
- **License:** MIT
- **Repository:** https://github.com/Afilimax/afilimax-cli

---

## 🛠 Tech Stack
- **Language:** TypeScript 7+
- **Runtime / Executable:** Node.js, TSX (`tsx ./src/index.ts`)
- **CLI Framework:** [Commander.js](https://github.com/tj/commander.js)
- **Providers Integration:** `@afilimax/amazon-browser-provider`, `@afilimax/mercado-livre-provider`, `@afilimax/shopee-provider`, `@afilimax/aliexpress-provider`, `@afilimax/magazine-luiza-provider`, `@afilimax/core`
- **Automation / Scraping:** Puppeteer (`puppeteer-extra`, `puppeteer-extra-plugin-stealth`)
- **Logging & Formatting:** [Winston](https://github.com/winstonjs/winston) with custom ANSI colorized helpers
- **Interactive Prompts:** `readline-sync`
- **Testing:** [Vitest](https://vitest.dev/)
- **Formatting & Linting:** Prettier (`@trivago/prettier-plugin-sort-imports`), ESLint

---

## 📁 Directory Structure
```
cli/
├── src/
│   ├── index.ts                      # CLI entry point (program setup, subcommand registration)
│   ├── commands/                     # Modular CLI commands
│   │   ├── index.ts                  # Central exporter for top-level commands (create, config)
│   │   ├── create/                   # Link generation commands
│   │   │   ├── index.ts              # Automatic platform resolution 'create <url>'
│   │   │   ├── amazon.ts             # 'create amazon <url>' (alias 'amz')
│   │   │   ├── mercado-livre.ts      # 'create mercado-livre <url>' (alias 'ml')
│   │   │   ├── shopee.ts             # 'create shopee <url>' (alias 'sh')
│   │   │   ├── aliexpress.ts         # 'create aliexpress <url>' (alias 'ali')
│   │   │   └── magazine-luiza.ts     # 'create magazine-luiza <url>' (alias 'magalu', 'mlz', 'luiza')
│   │   └── config/                   # Configuration management commands
│   │       ├── index.ts              # 'config' command group
│   │       ├── show.ts               # 'config show' (alias 'ls') command
│   │       ├── shopee.ts             # 'config shopee' (alias 'sh') command
│   │       ├── aliexpress.ts         # 'config aliexpress' (alias 'ali') command
│   │       ├── amazon/               # 'config amazon' (alias 'amz') command
│   │       │   ├── index.ts          # Command definition
│   │       │   ├── action.ts         # Command execution flow & prompts
│   │       │   └── cookie-collector.ts # Extension JSON & browser cookie collection logic
│   │       ├── mercado-livre/        # 'config mercado-livre' (alias 'ml') command
│   │       │   ├── index.ts          # Command definition
│   │       │   ├── action.ts         # Command execution flow & tag prompts
│   │       │   └── cookie-collector.ts # Extension JSON & browser cookie collection logic
│   │       └── magazine-luiza/       # 'config magazine-luiza' (alias 'magalu', 'mlz', 'luiza') command
│   │           ├── index.ts          # Command definition
│   │           ├── action.ts         # Command execution flow & slug prompts
│   │           └── cookie-collector.ts # Extension JSON & browser cookie collection logic
│   └── helpers/                      # Helper modules
│       ├── cli-banner.helper.ts      # Single-line ANSI Shadow ASCII banner renderer with repo links
│       ├── logger.helper.ts          # Winston logger & CLI display helpers (logSuccess, logCard, etc.)
│       ├── config.helper.ts          # App configuration helper (~/.afilimax/config.json persistence)
│       ├── puppeteer.helper.ts      # Stealth Puppeteer browser launcher factory
│       └── browser.helper.ts        # Browser opening utilities
├── __tests__/                        # Vitest unit test suite
├── .prettierrc.js                    # Prettier config with import sorting
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json                      # Project dependencies and NPM scripts
```

---

## 📜 Development Conventions & Coding Standards

1. **CamelCase Naming Rule:**
   - Always use **camelCase** for variable names, constant declarations, function names, and exported modules (e.g., `cliBanner`, `boxWidth`, `logSuccess`, `createAmazonCommand`, `areCookiesValid`). Avoid `lower_snake_case` or `UPPER_SNAKE_CASE`.

2. **Commander Option Flag Rules:**
   - Short flags (single dash `-`) MUST be single-character (e.g., `-i`, `-s`, `-u`, `-k`, `-t`).
   - Long flags MUST use double dashes (e.g., `--app-id`, `--app-secret`, `--sub-ids`, `--tracking-id`).
   - Multi-character single-dash flags like `-id` are invalid in Commander and must be avoided.

3. **Import Organization:**
   - Managed automatically via `@trivago/prettier-plugin-sort-imports`.
   - Order: Node native imports (`node:*`) ➔ Third-party modules (`commander`, `winston`) ➔ Local relative imports (`./...`).

4. **Modular Command Design:**
   - Every CLI command should be modularized inside its own folder/file under `src/commands/`.
   - Complex commands (like `config/amazon` or `config/mercado-livre`) should be split into `index.ts` (definition), `action.ts` (flow orchestration), and helper logic (`cookie-collector.ts`).
   - Re-export commands cleanly from `src/commands/index.ts` and register them in `src/index.ts`.

5. **Cookie Collector Flow & Multi-line Support:**
   - Support both Extension JSON paste (primary/recommended) and Browser login (fallback).
   - Cookie collection via JSON paste must handle multi-line input seamlessly via buffered reading in `readlineSync`.

6. **Logging & Output:**
   - Use `src/helpers/logger.helper.ts` helpers (`logSuccess`, `logInfo`, `logWarning`, `logError`, `logCard`, `logJson`) instead of raw `console.log` for status updates, cards, and structured output.

---

## 🚀 NPM Commands

- **Development Execution:**
  ```bash
  npm run dev -- [command] [options]
  # Examples:
  # npm run dev -- config show
  # npm run dev -- create "https://www.amazon.com.br/dp/B0D1VHJVS9/"
  # npm run dev -- config sh -i 18364590164 -s SECRET -u tibot
  ```
- **Build:**
  ```bash
  npm run build
  ```
- **Code Formatting:**
  ```bash
  npm run format
  ```
- **Linting:**
  ```bash
  npm run lint
  ```
- **Testing:**
  ```bash
  npm test
  ```
