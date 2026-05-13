import { cpSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename } from "node:path";

const ignoredNames = new Set([".DS_Store"]);

const copyOptions = {
  recursive: true,
  filter: (source) => !ignoredNames.has(basename(source))
};

rmSync("production", { recursive: true, force: true });

mkdirSync("production/assets", { recursive: true });
mkdirSync("production/content", { recursive: true });

cpSync("manifest.json", "production/manifest.json");
cpSync("src/assets", "production/assets", copyOptions);
cpSync("src/content/youtube-early.css", "production/content/youtube-early.css");

execFileSync("tsc", { stdio: "inherit" });
