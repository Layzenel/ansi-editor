// Dev mode: watch + copy into the BetterDiscord plugins folder (BD reloads the plugin on file change).
process.argv.push("--watch", "--deploy");
await import("./build.mjs");
