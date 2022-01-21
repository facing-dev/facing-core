const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build/web'),
    filename: 'main.bundle.js',
  },
  module: {
    rules: [
      {
        test: [/\.m?js$/],
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
                isTSX: true,
                allExtensions: true,

              }]
            ],
            plugins: [["@babel/plugin-proposal-decorators",{
              legacy:true

            }]]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'simler-test',
      template: './src/index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'src/assets'),
      publicPath: '/assets'
    },
    compress: true,
    port: 8080,
  }
}