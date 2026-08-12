import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { toTicketDTO } from '../dto/TicketDTO.js';

export class GetTicketById {
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
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket', id);
    }
    return toTicketDTO(ticket);
  }
}
