import { z } from 'zod';
import {
  TicketPriority,
  TicketStatus,
} from '../../../domain/entities/Ticket.js';

const statusEnum = z.enum(Object.values(TicketStatus));
const priorityEnum = z.enum(Object.values(TicketPriority));

export const createTicketSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional().default(''),
  priority: priorityEnum.optional().default(TicketPriority.MEDIUM),
});

export const updateTicketSchema = z
  .object({
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one of status or priority must be provided',
  });

export const listTicketsQuerySchema = z.object({
  status: statusEnum.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const ticketIdParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Express middleware factory for Zod validation.
 * @param {z.ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      return next(parsed.error);
    }
    req[source] = parsed.data;
    return next();
  };
}
