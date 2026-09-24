const path = require("path");
const jiti = require("jiti")(__filename);

async function run() {
  try {
    await jiti("./seed.ts");
  } catch (err) {
    console.error("Seed execution failed:", err);
    process.exit(1);
  }
}

run();
