/**
 * Ticket repository port (interface).
 *
 * @typedef {import('../entities/Ticket.js').Ticket} Ticket
 *
 * @typedef {Object} ITicketRepository
 * @property {(ticket: Ticket) => Promise<Ticket>} create
 * @property {(id: string) => Promise<Ticket|null>} findById
 * @property {(filters?: { status?: string, page?: number, limit?: number }) => Promise<{ items: Ticket[], total: number, page: number, limit: number }>} findAll
 * @property {(ticket: Ticket) => Promise<Ticket>} update
 * @property {(id: string) => Promise<boolean>} delete
 * @property {() => Promise<Record<string, number>>} countByStatus
 */

export {};
