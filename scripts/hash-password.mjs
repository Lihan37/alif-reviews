import bcrypt from "bcryptjs";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

const terminal = createInterface({ input: stdin, output: stdout });
const password = await terminal.question("Admin password or PIN: ");
terminal.close();
if (password.length < 4) {
  console.error("Use at least 4 characters.");
  process.exit(1);
}
const hash = await bcrypt.hash(password, 12);
const escapedHash = hash.replaceAll("$", "\\$");
console.log("\nPaste this complete line into .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${escapedHash}`);
