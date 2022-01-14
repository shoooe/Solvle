const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  entry: {
    inject: path.join(__dirname, "src/inject.ts"),
    background: path.join(__dirname, "src/background.ts"),
  },
  output: { path: path.join(__dirname, "dist"), filename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts"],
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
  ],
};

module.exports = config;
