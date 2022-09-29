const fs = require("fs");
const { execSync } = require("child_process");

fs.rmSync("./dist", { recursive: true, force: true });
execSync("npm run compile", { stdio: "inherit" });
fs.copyFileSync("./package.json", "./dist/package.json");
fs.copyFileSync("./README.md", "./dist/README.md");
fs.renameSync("./dist/index.js", "./dist/main.js");
fs.renameSync("./dist/index.js.map", "./dist/main.js.map");
execSync("npm run bundle", { stdio: "inherit" });
