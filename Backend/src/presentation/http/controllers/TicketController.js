import { asyncHandler } from '../middlewares/asyncHandler.js';

export class TicketController {
  /**
   * @param {{
   *   createTicket: import('../../../application/use-cases/CreateTicket.js').CreateTicket,
   *   getTicketById: import('../../../application/use-cases/GetTicketById.js').GetTicketById,
   *   listTickets: import('../../../application/use-cases/ListTickets.js').ListTickets,
   *   updateTicket: import('../../../application/use-cases/UpdateTicket.js').UpdateTicket,
   *   deleteTicket: import('../../../application/use-cases/DeleteTicket.js').DeleteTicket,
   * }} useCases
   */
  constructor(useCases) {
    this.useCases = useCases;
  }

  create = asyncHandler(async (req, res) => {
    const ticket = await this.useCases.createTicket.execute(req.body);
    res.status(201).json({ data: ticket });
  });

  getById = asyncHandler(async (req, res) => {
    const ticket = await this.useCases.getTicketById.execute(req.params.id);
    res.status(200).json({ data: ticket });
  });

  list = asyncHandler(async (req, res) => {
    const tickets = await this.useCases.listTickets.execute(req.query);
    res.status(200).json({ data: tickets });
  });

  update = asyncHandler(async (req, res) => {
    const ticket = await this.useCases.updateTicket.execute(
      req.params.id,
      req.body,
    );
    res.status(200).json({ data: ticket });
  });

  remove = asyncHandler(async (req, res) => {
    const result = await this.useCases.deleteTicket.execute(req.params.id);
    res.status(200).json({ data: result });
  });
}
