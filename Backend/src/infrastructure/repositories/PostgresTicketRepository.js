import { Ticket } from '../../../domain/entities/Ticket.js';
import { TicketStatus } from '../../../domain/entities/Ticket.js';

function mapRowToTicket(row) {
  return new Ticket({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
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

  async create(ticket) {
    const result = await this.pool.query(
      `INSERT INTO tickets
        (id, title, description, status, priority, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.priority,
        ticket.createdAt,
      ],
    );
    return mapRowToTicket(result.rows[0]);
  }

  async findById(id) {
    const result = await this.pool.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) return null;
    return mapRowToTicket(result.rows[0]);
  }

  /**
   * @param {{ status?: string, page?: number, limit?: number }} [filters]
   */
  async findAll(filters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));
    const offset = (page - 1) * limit;

    const clauses = [];
    const values = [];

    if (filters.status) {
      values.push(filters.status);
      clauses.push(`status = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    const countResult = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM tickets ${where}`,
      values,
    );
    const total = countResult.rows[0].total;

    const listValues = [...values, limit, offset];
    const result = await this.pool.query(
      `SELECT * FROM tickets ${where}
       ORDER BY created_at DESC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      listValues,
    );

    return {
      items: result.rows.map(mapRowToTicket),
      total,
      page,
      limit,
    };
  }

  async update(ticket) {
    const result = await this.pool.query(
      `UPDATE tickets
       SET title = $2,
           description = $3,
           status = $4,
           priority = $5
       WHERE id = $1
       RETURNING *`,
      [
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.priority,
      ],
    );
    if (result.rowCount === 0) return null;
    return mapRowToTicket(result.rows[0]);
  }

  async delete(id) {
    const result = await this.pool.query(
      `DELETE FROM tickets WHERE id = $1`,
      [id],
    );
    return result.rowCount > 0;
  }

  async countByStatus() {
    const result = await this.pool.query(
      `SELECT status, COUNT(*)::int AS count
       FROM tickets
       GROUP BY status`,
    );

    const stats = {
      [TicketStatus.OPEN]: 0,
      [TicketStatus.IN_PROGRESS]: 0,
      [TicketStatus.CLOSED]: 0,
    };

    for (const row of result.rows) {
      stats[row.status] = row.count;
    }

    return stats;
  }
}
