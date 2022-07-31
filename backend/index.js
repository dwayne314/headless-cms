// Transpile all code following this line with babel and use babel's ES6 preset.
require("@babel/register")({
  presets: ["@babel/preset-env"],
});

module.exports = require("./server.js");
