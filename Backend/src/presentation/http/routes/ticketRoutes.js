import { Router } from 'express';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamSchema,
  updateTicketSchema,
  validate,
} from '../validators/ticketValidators.js';

/**
 * @param {import('../controllers/TicketController.js').TicketController} ticketController
 */
export function createTicketRoutes(ticketController) {
  const router = Router();

  router.get(
    '/',
    validate(listTicketsQuerySchema, 'query'),
    ticketController.list,
  );

  router.post(
    '/',
    validate(createTicketSchema, 'body'),
    ticketController.create,
  );

  router.get(
    '/:id',
    validate(ticketIdParamSchema, 'params'),
    ticketController.getById,
  );

  router.patch(
    '/:id',
    validate(ticketIdParamSchema, 'params'),
    validate(updateTicketSchema, 'body'),
    ticketController.update,
  );

  router.delete(
    '/:id',
    validate(ticketIdParamSchema, 'params'),
    ticketController.remove,
  );

  return router;
}
