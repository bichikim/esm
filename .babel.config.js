"use strict"

const isTest = /test/.test(process.env.ESM_ENV)

module.exports = {
  env: {
    production: {
      plugins: [
        ["transform-remove-console", {
          exclude: ["error"]
        }]
      ]
    }
  },
  plugins: [
    ["@babel/proposal-class-properties", {
      loose: true
    }],
    ["@babel/transform-arrow-functions", {
      spec: false
    }],
    ["@babel/transform-block-scoping", {
      throwIfClosureRequired: false
    }],
    ["transform-for-of-as-array", {
      loose: true
    }]
  ],
  presets: [
    ["@babel/env", {
      debug: isTest,
      exclude: [
        "transform-async-to-generator",
        "transform-for-of",
        "transform-function-name"
      ],
      loose: true,
      modules: false,
      targets: { node: 6 }
    }]
  ]
}
