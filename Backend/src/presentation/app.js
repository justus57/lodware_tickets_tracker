import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createApiRouter } from './http/routes/index.js';
import { errorHandler } from './http/middlewares/errorHandler.js';
import { notFoundHandler } from './http/middlewares/notFoundHandler.js';
import { env } from '../infrastructure/config/env.js';

/**
 * Builds the Express application (framework adapter).
 * @param {{ ticketController: import('./http/controllers/TicketController.js').TicketController }} deps
 */
export function createApp(deps) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  app.get('/', (_req, res) => {
    res.status(200).json({
      name: env.appName,
      version: '1.0.0',
    });
  });

  // Assessment paths: /tickets, /tickets/:id, /tickets/stats
  app.use(createApiRouter(deps));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
