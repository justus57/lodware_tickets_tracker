import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '../../domain/entities/Ticket.js';
import { toTicketDTO } from '../dto/TicketDTO.js';

export class CreateTicket {
  /**
   * @param {import('../../domain/repositories/ITicketRepository.js').ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * @param {{ title: string, description?: string, priority?: string, assigneeId?: string|null }} input
   */
  async execute(input) {
    const ticket = Ticket.create({
      id: uuidv4(),
      title: input.title,
      description: input.description ?? '',
      priority: input.priority,
      assigneeId: input.assigneeId ?? null,
    });

    const created = await this.ticketRepository.create(ticket);
    return toTicketDTO(created);
  }
}
