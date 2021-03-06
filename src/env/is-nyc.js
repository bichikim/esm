import has from "../util/has.js"
import isOwnPath from "../util/is-own-path.js"
import normalize from "../path/normalize.js"
import readJSON from "../fs/read-json.js"
import safeProcess from "../safe/process.js"
import shared from "../shared.js"

function getOwnParent() {
  const seen = new Set

  let { parent } = __non_webpack_module__

  while (parent &&
      isOwnPath(parent.filename) &&
      ! seen.has(parent)) {
    parent = parent.parent
    seen.add(parent)
  }

  return parent
}

function isNyc() {
  const { env } = shared

  if (Reflect.has(env, "nyc")) {
    return env.nyc
  }

  if (has(safeProcess.env, "NYC_ROOT_ID")) {
    return env.nyc = true
  }

  const parent = getOwnParent()
  const parentFilename = parent && normalize(parent.filename)

  const nycIndex = parentFilename
    ? parentFilename.lastIndexOf("/node_modules/nyc/")
    : -1

  if (nycIndex === -1) {
    return env.nyc = false
  }

  const nycPath = parentFilename.slice(0, nycIndex + 18) + "package.json"
  const nycJSON = readJSON(nycPath)

  return env.nyc =
    has(nycJSON, "name") &&
    nycJSON.name === "nyc"
}

export default isNyc
