import { toTicketDTOList } from '../dto/TicketDTO.js';

export class ListTickets {
  /**
   * @param {import('../../domain/repositories/ITicketRepository.js').ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * @param {{ status?: string, page?: number, limit?: number }} [filters]
   */
  async execute(filters = {}) {
    const result = await this.ticketRepository.findAll(filters);
    return {
      data: toTicketDTOList(result.items),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 0,
      },
    };
  }
}
