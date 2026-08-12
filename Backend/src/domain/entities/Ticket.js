import { ValidationError } from '../errors/ValidationError.js';

export const TicketStatus = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
});

export const TicketPriority = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

const ALLOWED_STATUSES = new Set(Object.values(TicketStatus));
const ALLOWED_PRIORITIES = new Set(Object.values(TicketPriority));

/**
 * Domain entity — pure business rules, no framework deps.
 */
export class Ticket {
  constructor({
    id,
    title,
    description = '',
    status = TicketStatus.OPEN,
    priority = TicketPriority.MEDIUM,
    createdAt = new Date(),
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);

    this.#assertValid();
  }

  static create({ id, title, description, priority }) {
    return new Ticket({
      id,
      title,
      description,
      status: TicketStatus.OPEN,
      priority: priority ?? TicketPriority.MEDIUM,
      createdAt: new Date(),
    });
  }

  update({ title, description, status, priority }) {
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (status !== undefined) this.status = status;
    if (priority !== undefined) this.priority = priority;
    this.#assertValid();
    return this;
  }

  #assertValid() {
    if (!this.id) {
      throw new ValidationError('Ticket id is required');
    }
    if (!this.title || typeof this.title !== 'string' || !this.title.trim()) {
      throw new ValidationError('Ticket title is required');
    }
    if (this.title.trim().length > 200) {
      throw new ValidationError('Ticket title must be at most 200 characters');
    }
    if (!ALLOWED_STATUSES.has(this.status)) {
      throw new ValidationError(`Invalid ticket status: ${this.status}`);
    }
    if (!ALLOWED_PRIORITIES.has(this.priority)) {
      throw new ValidationError(`Invalid ticket priority: ${this.priority}`);
    }
  }

  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
