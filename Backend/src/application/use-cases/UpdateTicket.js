import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { toTicketDTO } from '../dto/TicketDTO.js';

export class UpdateTicket {
  /**
   * @param {import('../../domain/repositories/ITicketRepository.js').ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * @param {string} id
   * @param {{ status?: string, priority?: string }} input
   */
  async execute(id, input) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket', id);
    }

    ticket.update(input);
    const updated = await this.ticketRepository.update(ticket);
    return toTicketDTO(updated);
  }
}
