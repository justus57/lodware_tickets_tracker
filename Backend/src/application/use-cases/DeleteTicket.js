import { NotFoundError } from '../../domain/errors/NotFoundError.js';

export class DeleteTicket {
  /**
   * @param {import('../../domain/repositories/ITicketRepository.js').ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * @param {string} id
   */
  async execute(id) {
    const deleted = await this.ticketRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Ticket', id);
    }
    return { id, deleted: true };
  }
}
