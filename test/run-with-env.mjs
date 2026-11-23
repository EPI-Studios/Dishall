import { spawn } from "node:child_process";

// Charge .env.test dans l'environnement, puis lance la commande demandée
process.loadEnvFile(".env.test");

const [command, ...args] = process.argv.slice(2);

const child = spawn(command, args, {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32", // nécessaire pour trouver les .cmd sous Windows
});

child.on("exit", (code) => process.exit(code ?? 1));