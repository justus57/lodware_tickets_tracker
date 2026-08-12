import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

/**
 * Creates a PostgreSQL connection pool.
 * Prefer DATABASE_URL when set; otherwise use discrete DB_* vars.
 */
export function createPool() {
  const config = env.database.url
    ? {
        connectionString: env.database.url,
        ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
      }
    : {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: env.database.name,
        ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
      };

  return new Pool({
    ...config,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}
