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
  assigneeId: z.string().trim().min(1).max(100).nullable().optional(),
});

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    assigneeId: z.string().trim().min(1).max(100).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const listTicketsQuerySchema = z.object({
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
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
