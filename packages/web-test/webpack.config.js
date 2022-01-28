const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const baseConfig = require("../webpack.config")
const config = merge(baseConfig, {
  mode: 'development',
  entry: path.resolve(__dirname,'./src/main.ts'),
  output: {
    path: path.resolve(__dirname, 'build/web'),
    filename: 'main.bundle.js',
  },
  resolve: {
    alias: {

      'core-js': path.resolve(__dirname, 'node_modules/core-js')
    }
  },
  module: {
    rules: [
      {
        test: [/\.m?jsx?$/],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                "corejs": "3"
              }]
            ]
          }
        }
      },
      {
        test: [/\.m?tsx?$/],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                "corejs": "3",
                "useBuiltIns": "usage"
              }],
              ["@babel/preset-typescript", {
                // isTSX: true,
                // allExtensions: true,
                // jsxPragma:"h",
                // jsxPragmaFrag:"hFrag"

              }]
            ],
            plugins: [["@babel/plugin-proposal-decorators", {
              legacy: true

            }],["@babel/plugin-transform-react-jsx",{
              runtime:"classic",
              pragma:"h",
              pragmaFrag:"hFrag"
            }]]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'simler-test',
      template: path.resolve(__dirname,'./src/index.html')
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: "write-references",
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname,"./src/assets"),
          to: path.resolve(__dirname,"./assets")
        },

      ],
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'src/assets'),
      publicPath: path.resolve(__dirname,'/assets')
    },
    compress: true,
    port: 8080,
  }
})

module.exports = config