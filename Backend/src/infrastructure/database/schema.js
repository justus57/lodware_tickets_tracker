import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '../../../database/schema.sql');

export const CREATE_TICKETS_TABLE = readFileSync(schemaPath, 'utf8');

/**
 * Runs schema migrations against the given pool.
 * @param {import('pg').Pool} pool
 */
export async function runMigrations(pool) {
  await pool.query(CREATE_TICKETS_TABLE);
}
