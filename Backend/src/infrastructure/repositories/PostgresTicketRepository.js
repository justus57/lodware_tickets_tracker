import { Ticket } from '../../../domain/entities/Ticket.js';

/**
 * Maps a PostgreSQL row to a domain Ticket entity.
 * @param {Record<string, unknown>} row
 */
function mapRowToTicket(row) {
  return new Ticket({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    assigneeId: row.assignee_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

/**
 * PostgreSQL adapter for ITicketRepository.
 */
export class PostgresTicketRepository {
  /**
   * @param {import('pg').Pool} pool
   */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * @param {Ticket} ticket
   */
  async create(ticket) {
    const result = await this.pool.query(
      `INSERT INTO tickets
        (id, title, description, status, priority, assignee_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.priority,
        ticket.assigneeId,
        ticket.createdAt,
        ticket.updatedAt,
      ],
    );
    return mapRowToTicket(result.rows[0]);
  }

  /**
   * @param {string} id
   */
  async findById(id) {
    const result = await this.pool.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) return null;
    return mapRowToTicket(result.rows[0]);
  }

  /**
   * @param {{ status?: string, priority?: string }} [filters]
   */
  async findAll(filters = {}) {
    const clauses = [];
    const values = [];

    if (filters.status) {
      values.push(filters.status);
      clauses.push(`status = $${values.length}`);
    }
    if (filters.priority) {
      values.push(filters.priority);
      clauses.push(`priority = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await this.pool.query(
      `SELECT * FROM tickets ${where} ORDER BY created_at DESC`,
      values,
    );
    return result.rows.map(mapRowToTicket);
  }

  /**
   * @param {Ticket} ticket
   */
  async update(ticket) {
    const result = await this.pool.query(
      `UPDATE tickets
       SET title = $2,
           description = $3,
           status = $4,
           priority = $5,
           assignee_id = $6,
           updated_at = $7
       WHERE id = $1
       RETURNING *`,
      [
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.priority,
        ticket.assigneeId,
        ticket.updatedAt,
      ],
    );
    if (result.rowCount === 0) return null;
    return mapRowToTicket(result.rows[0]);
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    const result = await this.pool.query(
      `DELETE FROM tickets WHERE id = $1`,
      [id],
    );
    return result.rowCount > 0;
  }
}
