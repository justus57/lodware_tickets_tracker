import { toTicketDTOList } from '../dto/TicketDTO.js';

export class ListTickets {
  /**
   * @param {import('../../domain/repositories/ITicketRepository.js').ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * @param {{ status?: string, priority?: string }} [filters]
   */
  async execute(filters = {}) {
    const tickets = await this.ticketRepository.findAll(filters);
    return toTicketDTOList(tickets);
  }
}
