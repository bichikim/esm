import assert from "assert"

const canTestLiveBinding = Reflect.has(process.versions, "v8")

describe("import declarations", () => {
  it("should support same symbol as different locals", () =>
    import("./import/locals.mjs")
      .then((ns) => ns.default())
  )

  it("should support mixed import styles for CJS and ES modules", () =>
    import("./cjs/import/mixed.mjs")
      .then((ns) => ns.default())
  )

  it("should support CJS modules setting `module.exports`", () =>
    import("./cjs/import/exports.js")
      .then((ns) => ns.default())
  )

  it("should parse URL ids", () =>
    import("./import/url-ids.mjs")
      .then((ns) => ns.default())
  )

  it("should not parse URL ids with encoded slashes", () =>
    import("./import/url-slashes.mjs")
      .then(() => assert.ok(false))
      .catch((e) => assert.strictEqual(e.code, "MODULE_NOT_FOUND"))
  )

  ;(canTestLiveBinding ? it : xit)(
  "should support live binding of named exports for CJS modules", () =>
    import("./cjs/import/live.js")
      .then((ns) => ns.default())
  )
})
