const path = require("path");

module.exports = {
  entry: ["regenerator-runtime/runtime.js", "./src/public/js/app.js"],
  // mode: "development", //packeage.json 통해 명령어 실행
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
