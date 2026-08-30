module.exports = {
    semi: false,
    singleQuote: false,
    tabWidth: 4,
    useTabs: false,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: ["^node:(.*)$", "<THIRD_PARTY_MODULES>", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    endOfLine: "auto",
    printWidth: 120,
}