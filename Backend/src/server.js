import { env } from './infrastructure/config/env.js';
import { createPool } from './infrastructure/database/pool.js';
import { runMigrations } from './infrastructure/database/schema.js';
import { createContainer } from './container.js';
import { createApp } from './presentation/app.js';

async function bootstrap() {
  const pool = createPool();

  try {
    await pool.query('SELECT 1');
    await runMigrations(pool);
  } catch (err) {
    console.error('Failed to connect or migrate PostgreSQL:', err.message);
    process.exit(1);
  }

  const { ticketController } = createContainer(pool);
  const app = createApp({ ticketController });

  const server = app.listen(env.port, () => {
    console.log(
      `${env.appName} listening on http://localhost:${env.port} [${env.nodeEnv}]`,
    );
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap();
