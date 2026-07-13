import { spawnSync } from "node:child_process";
import path from "node:path";

const executable = process.execPath;
const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(executable, [nextCli, "build"], {
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "true" },
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
