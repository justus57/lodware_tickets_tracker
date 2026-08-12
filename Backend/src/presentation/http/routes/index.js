import { Router } from 'express';
import { createTicketRoutes } from './ticketRoutes.js';

/**
 * @param {{ ticketController: import('../controllers/TicketController.js').TicketController }} deps
 */
export function createApiRouter(deps) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.use('/tickets', createTicketRoutes(deps.ticketController));

  return router;
}
