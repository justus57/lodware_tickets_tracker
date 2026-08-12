export class GetTicketStats {
  /**
   * @param {import('../../domain/repositories/ITicketRepository.js').ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async execute() {
    return this.ticketRepository.countByStatus();
  }
}
