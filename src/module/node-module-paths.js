// Based on Node's `Module._nodeModulePaths` method.
// Copyright Node.js contributors. Released under MIT license:
// https://github.com/nodejs/node/blob/master/lib/module.js

import ASCII from "../ascii.js"
import GenericArray from "../generic/array.js"
import GenericString from "../generic/string.js"

import { resolve } from "path"
import shared from "../shared.js"

const {
  BSLASH,
  COLON,
  SLASH
} = ASCII

const nmChars = GenericArray.map("node_modules", (char) => {
  return GenericString.charCodeAt(char, 0)
})

GenericArray.reverse(nmChars)

const nmLength = nmChars.length

function nodeModulePaths(from) {
  return shared.env.win32
    ? win32Paths(from)
    : posixPaths(from)
}

function posixPaths(from) {
  from = resolve(from)

  // Return early not only to avoid unnecessary work, but to avoid returning
  // an array of two items for a root path: ["//node_modules", "/node_modules"]
  if (from === "/") {
    return ["/node_modules"]
  }

  // This approach only works when the path is guaranteed to be absolute.
  // Doing a fully-edge-case-correct `path.split()` that works on both Windows
  // and Posix is non-trivial.
  let { length } = from
  let last = length
  let nmCount = 0

  const paths = []

  while (length--) {
    const code = GenericString.charCodeAt(from, length)

    if (code === SLASH) {
      if (nmCount !== nmLength) {
        GenericArray.push(paths, GenericString.slice(from, 0, last) + "/node_modules")
      }

      last = length
      nmCount = 0
    } else if (nmCount !== -1) {
      if (nmChars[nmCount] === code) {
        ++nmCount
      } else {
        nmCount = -1
      }
    }
  }

  // Append "/node_modules" to handle root paths.
  GenericArray.push(paths, "/node_modules")

  return paths
}

function win32Paths(from) {
  from = resolve(from)

  // Return root node_modules when path is "D:\\".
  if (GenericString.charCodeAt(from, from.length - 1) === BSLASH &&
      GenericString.charCodeAt(from, from.length - 2) === COLON) {
    return [from + "node_modules"]
  }

  let { length } = from
  let last = length
  let nmCount = 0

  const paths = []

  while (length--) {
    const code = GenericString.charCodeAt(from, length)

    // The path segment separator check ("\" and "/") was used to get
    // node_modules path for every path segment. Use colon as an extra
    // condition since we can get node_modules path for drive root like
    // "C:\node_modules" and don"t need to parse drive name.
    if (code === BSLASH ||
        code === COLON ||
        code === SLASH) {
      if (nmCount !== nmLength) {
        GenericArray.push(paths, GenericString.slice(from, 0, last) + "\\node_modules")
      }

      last = length
      nmCount = 0
    } else if (nmCount !== -1) {
      if (nmChars[nmCount] === code) {
        ++nmCount
      } else {
        nmCount = -1
      }
    }
  }

  return paths
}

export default nodeModulePaths
