import path from "path"
import require from "./require.js"

import "./compiler-tests.mjs"
import "./dynamic-import-tests.mjs"
import "./export-tests.mjs"
import "./file-extension-tests.mjs"
import "./import-tests.js"
import "./misc-tests.js"
import "./output-tests.mjs"
import "./setter-tests.js"
import "./top-level-await.js"
import "./url-tests.mjs"
import "./check-hook-tests.mjs"
import "./eval-hook-tests.mjs"
import "./cli-hook-tests.mjs"
import "./main-hook-tests.mjs"
import "./require-hook-tests.js"
import "./repl-hook-tests.mjs"
import "./scenario-tests.mjs"

const jsonExt = require.extensions[".json"]

beforeEach(() => {
  Reflect.deleteProperty(global, "customError")
  Reflect.deleteProperty(global, "loadCount")
  Reflect.deleteProperty(global, "this")

  Reflect.deleteProperty(require.cache, path.resolve("fixture/load-count.js"))
  Reflect.deleteProperty(require.extensions, ".coffee")

  require.extensions[".json"] = jsonExt
})
