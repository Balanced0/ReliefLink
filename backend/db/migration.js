import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { db } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "migrations");

await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

const files = await fs.readdir(migrationsDir);
files.sort();

const [appliedRows] = await db.execute(
    "SELECT filename FROM migrations"
);

const applied = new Set(
    appliedRows.map(row => row.filename)
);

for (const file of files) {
    if (!file.endsWith(".sql")) {
        continue;
    }

    if (applied.has(file)) {
        continue;
    }

    console.log(`Running migration: ${file}`);

    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, "utf8");

    try {
        await db.query(sql);

        await db.execute(
        "INSERT INTO migrations (filename) VALUES (?)",
        [file]
        );

        console.log(`Applied: ${file}`);

    } catch (err) {
        console.error(`Migration failed: ${file}`);
        console.error(err);

        process.exit(1);
    }
}

console.log("Migrations complete.");

await db.end();