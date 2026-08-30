import { expect, test } from "vitest"
import { main } from "../src/index"

test("main should be a function", () => {
    expect(typeof main).toBe("function")
})
