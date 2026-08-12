import { Ticket } from '../../domain/entities/Ticket.js';

/**
 * @param {import('../../domain/entities/Ticket.js').Ticket} ticket
 */
export function toTicketDTO(ticket) {
  return ticket.toObject();
}

/**
 * @param {import('../../domain/entities/Ticket.js').Ticket[]} tickets
 */
export function toTicketDTOList(tickets) {
  return tickets.map(toTicketDTO);
}

/**
 * Rehydrate a plain object into a domain entity (e.g. from persistence).
 * @param {Record<string, unknown>} raw
 */
export function toTicketEntity(raw) {
  return new Ticket(raw);
}
