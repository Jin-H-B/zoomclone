const path = require("path");

module.exports = {
  entry: ["regenerator-runtime/runtime.js", "./src/public/js/app.js"],
  mode: "development",
  output: {
    filename: "js/app.js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
