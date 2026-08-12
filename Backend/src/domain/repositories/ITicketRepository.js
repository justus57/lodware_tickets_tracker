/**
 * Ticket repository port (interface).
 * Infrastructure adapters must implement these methods.
 *
 * @typedef {import('../entities/Ticket.js').Ticket} Ticket
 *
 * @typedef {Object} ITicketRepository
 * @property {(ticket: Ticket) => Promise<Ticket>} create
 * @property {(id: string) => Promise<Ticket|null>} findById
 * @property {(filters?: { status?: string, priority?: string }) => Promise<Ticket[]>} findAll
 * @property {(ticket: Ticket) => Promise<Ticket>} update
 * @property {(id: string) => Promise<boolean>} delete
 */

export {};
