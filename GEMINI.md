# GEMINI.md - Project Documentation & Guidelines

## 📌 Project Overview
**CLI Template** is a modern, modular TypeScript template for creating feature-rich Command Line Interface (CLI) applications using `commander`, `winston`, and `tsx`.

- **Author:** Marcuth
- **License:** MIT

---

## 🛠 Tech Stack
- **Language:** TypeScript 7+
- **Runtime / Executable:** Node.js, TSX (`tsx ./src/index.ts`)
- **CLI Framework:** [Commander.js](https://github.com/tj/commander.js)
- **Logging & Formatting:** [Winston](https://github.com/winstonjs/winston) with custom ANSI colorized helpers
- **Testing:** [Vitest](https://vitest.dev/)
- **Formatting & Linting:** Prettier (`@trivago/prettier-plugin-sort-imports`), ESLint

---

## 📁 Directory Structure
```
cli/
├── src/
│   ├── index.ts                      # CLI entry point (program setup, subcommand registration)
│   ├── commands/                     # Modular CLI commands
│   │   ├── index.ts                  # Central exporter for commands
│   │   ├── example/                  # Example command with subcommand
│   │   │   ├── index.ts              # Main 'example' (alias 'ex') command
│   │   │   └── subcommand.ts         # Subcommand 'subcommand' (alias 'sub')
│   │   └── sum/                      # Example math command
│   │       └── index.ts              # 'sum' (alias 'add') command
│   └── helpers/                      # Helper modules
│       ├── cli-banner.helper.ts      # Custom ASCII Shadow banner renderer
│       ├── logger.helper.ts          # Winston logger & CLI display helpers (logSuccess, logCard, etc.)
│       └── config.helper.ts          # App configuration helper
├── __tests__/                        # Vitest unit test suite
├── .prettierrc.js                    # Prettier config with import sorting
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json                      # Project dependencies and NPM scripts
```

---

## 📜 Development Conventions & Coding Standards

1. **CamelCase Naming Rule:**
   - Always use **camelCase** for variable names, constant declarations, function names, and exported modules (e.g., `cliBanner`, `boxWidth`, `logSuccess`, `exampleCommand`). Avoid `lower_snake_case` or `UPPER_SNAKE_CASE`.

2. **Import Organization:**
   - Managed automatically via `@trivago/prettier-plugin-sort-imports`.
   - Order: Node native imports (`node:*`) ➔ Third-party modules (`commander`, `winston`) ➔ Local relative imports (`./...`).

3. **Command Design:**
   - Every CLI command should be modularized inside its own folder under `src/commands/`.
   - Subcommands should be placed alongside their parent command and exported appropriately.
   - All commands should be re-exported from `src/commands/index.ts` and registered in `src/index.ts`.

4. **Logging:**
   - Use `src/helpers/logger.helper.ts` helpers (`logSuccess`, `logInfo`, `logWarning`, `logError`, `logCard`, `logSearchResults`, `logJson`) instead of raw `console.log` for status updates and structured output.

---

## 🚀 NPM Commands

- **Development Execution:**
  ```bash
  npm run dev -- [command] [options]
  # Examples:
  # npm run dev -- example
  # npm run dev -- example sub
  # npm run dev -- sum 10 20 30
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
