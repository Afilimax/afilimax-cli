import { exec } from "node:child_process"
import os from "node:os"

export function openInBrowser(url: string): void {
    const platform = os.platform()

    if (platform === "win32") {
        exec(`start "" "${url}"`)
    } else if (platform === "darwin") {
        exec(`open "${url}"`)
    } else {
        exec(`xdg-open "${url}"`)
    }
}
