import dotenv from 'dotenv';

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  appName: process.env.APP_NAME ?? 'lodware-ticket-tracker',
  database: Object.freeze({
    url: process.env.DATABASE_URL,
    host: required('DB_HOST', 'localhost'),
    port: Number(required('DB_PORT', '5432')),
    user: required('DB_USER', 'postgres'),
    password: required('DB_PASSWORD', 'postgres'),
    name: required('DB_NAME', 'lodware_tickets'),
    ssl: (process.env.DB_SSL ?? 'false').toLowerCase() === 'true',
  }),
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
});
