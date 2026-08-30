import { executablePath } from "puppeteer"
import { PuppeteerExtra } from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

export function createStealthBrowser(): PuppeteerExtra {
    const puppeteer = new PuppeteerExtra(require("puppeteer"))
    puppeteer.use(StealthPlugin())
    return puppeteer
}

export function getBrowserExecutablePath(): string {
    return executablePath()
}
