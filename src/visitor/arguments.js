import Visitor from "../visitor.js"

import { getLineInfo } from "../acorn.js"
import isIdentifier from "../parse/is-identifier.js"
import shared from "../shared.js"

function init() {
  const definedMap = new WeakMap

  class ArgumentsVisitor extends Visitor {
    reset(rootPath, options) {
      this.magicString = options.magicString
      this.possibleIndexes = options.possibleIndexes
      this.warnedForArguments = false
      this.warnings = options.warnings
    }

    visitIdentifier(path) {
      if (this.warnedForArguments) {
        return
      }

      const node = path.getValue()

      if (node.name !== "arguments") {
        return
      }

      const parent = path.getParentNode()

      if ((parent.type === "UnaryExpression" &&
           parent.operator === "typeof") ||
          ! isIdentifier(node, parent) ||
          isArgumentsDefined(path)) {
        return
      }

      const {
        column,
        line
      } = getLineInfo(this.magicString.original, node.start)

      this.warnedForArguments = true

      this.warnings.push({
        args: [line, column],
        code: "WRN_ARGUMENTS_ACCESS"
      })
    }

    visitWithoutReset(path) {
      if (! this.warnedForArguments) {
        super.visitWithoutReset(path)
      }
    }
  }

  function isArgumentsDefined(path) {
    let defined = false

    path.getParentNode((parent) => {
      defined = definedMap.get(parent)

      if (defined) {
        return defined
      }

      const { type } = parent

      defined =
        type === "FunctionDeclaration" ||
        type === "FunctionExpression"

      definedMap.set(parent, defined)
      return defined
    })

    return defined
  }

  return new ArgumentsVisitor
}

export default shared.inited
  ? shared.module.visitorArguments
  : shared.module.visitorArguments = init()
