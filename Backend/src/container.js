import { CreateTicket } from './application/use-cases/CreateTicket.js';
import { GetTicketById } from './application/use-cases/GetTicketById.js';
import { ListTickets } from './application/use-cases/ListTickets.js';
import { UpdateTicket } from './application/use-cases/UpdateTicket.js';
import { DeleteTicket } from './application/use-cases/DeleteTicket.js';
import { GetTicketStats } from './application/use-cases/GetTicketStats.js';
import { PostgresTicketRepository } from './infrastructure/repositories/PostgresTicketRepository.js';
import { TicketController } from './presentation/http/controllers/TicketController.js';

/**
 * Composition root — wires dependencies (DI).
 * @param {import('pg').Pool} pool
 */
export function createContainer(pool) {
  const ticketRepository = new PostgresTicketRepository(pool);

  const createTicket = new CreateTicket(ticketRepository);
  const getTicketById = new GetTicketById(ticketRepository);
  const listTickets = new ListTickets(ticketRepository);
  const updateTicket = new UpdateTicket(ticketRepository);
  const deleteTicket = new DeleteTicket(ticketRepository);
  const getTicketStats = new GetTicketStats(ticketRepository);

  const ticketController = new TicketController({
    createTicket,
    getTicketById,
    listTickets,
    updateTicket,
    deleteTicket,
    getTicketStats,
  });

  return {
    ticketRepository,
    ticketController,
  };
}
