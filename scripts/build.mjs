// Production build: bundles src/index.tsx into AnsiEditor.plugin.js (repo root, committed: the BetterDiscord site reads it from GitHub).
// Flags: --watch (rebuild on change), --deploy (copy the result into the BetterDiscord plugins folder).
import { build, context } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const meta = JSON.parse(readFileSync(join(root, "src/meta.json"), "utf8"));
const outfile = join(root, "AnsiEditor.plugin.js");
const args = new Set(process.argv.slice(2));

const banner = [
  "/**",
  ` * @name ${meta.name}`,
  ` * @author ${meta.author}`,
  ` * @description ${meta.description}`,
  ` * @version ${meta.version}`,
  ` * @source ${meta.source}`,
  " */",
].join("\n");

/** Resolves the BetterDiscord plugins folder from BD_PLUGINS_DIR or the per-OS default. */
export function pluginsDir() {
  if (process.env.BD_PLUGINS_DIR) return process.env.BD_PLUGINS_DIR;
  if (process.platform === "win32") return join(process.env.APPDATA ?? "", "BetterDiscord/plugins");
  if (process.platform === "darwin")
    return join(homedir(), "Library/Application Support/BetterDiscord/plugins");
  return join(homedir(), ".config/BetterDiscord/plugins");
}

function deploy() {
  const dir = pluginsDir();
  mkdirSync(dir, { recursive: true });
  copyFileSync(outfile, join(dir, "AnsiEditor.plugin.js"));
  console.log(`[AnsiEditor] copied to ${dir}`);
}

const deployPlugin = {
  name: "deploy",
  setup(b) {
    b.onEnd((result) => {
      if (result.errors.length) return;
      console.log(`[AnsiEditor] built ${outfile}`);
      if (args.has("--deploy")) deploy();
    });
  },
};

const options = {
  entryPoints: [join(root, "src/index.tsx")],
  outfile,
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "chrome120",
  charset: "utf8",
  legalComments: "none",
  loader: { ".css": "text" },
  jsxFactory: "BdApi.React.createElement",
  jsxFragment: "BdApi.React.Fragment",
  banner: { js: banner },
  // BetterDiscord expects module.exports to be the plugin class itself.
  footer: { js: "module.exports = module.exports.default;" },
  plugins: [deployPlugin],
  logLevel: "warning",
};

if (args.has("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("[AnsiEditor] watching for changes…");
} else {
  await build(options);
}
