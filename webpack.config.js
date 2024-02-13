const { resolve } = require("path")
const { env } = require("process")
const webpack = require('webpack')

const entry = {
  contentScript: "./src/contentScript/index.js",
  background: "./src/background/index.js",
  popup: "./src/popup/popup.js",
  options: "./src/options/options.js",
//   faqs: "./src/faqs/faqs.tsx",
//   ctx: "./src/contentScript/ctx.js"
}

const common = {
  entry,
  output: {
    path: resolve(__dirname, env.FIREFOX ? "buildFf": "build", "unpacked")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
            "style-loader", 
            {
              loader: "css-loader",
              options: {
                url: false,
                importLoaders: 1
              }
            },
            "postcss-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js"],
    alias: {
      src: resolve(__dirname, "src"),
      notFirefox: env.FIREFOX ? false : resolve(__dirname, "src"),
      isFirefox: env.FIREFOX ? resolve(__dirname, "src") : false 
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      gvar: [resolve(__dirname, "src", "globalVar.js"), "gvar"]
    })
  ]
}

if (env.NODE_ENV === "production") {
  module.exports = {
    ...common,
    mode: "production"
  }
} else {
  module.exports = {
    ...common,
    mode: "development",
    devtool: false
    // devtool: "eval-source-map" // requires manifest to be loosened into "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
  }
}