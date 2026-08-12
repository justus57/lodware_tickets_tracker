import { createPool } from './pool.js';
import { runMigrations } from './schema.js';

async function main() {
  const pool = createPool();
  try {
    await runMigrations(pool);
    console.log('Migrations applied successfully.');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
