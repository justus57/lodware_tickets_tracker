import { useEffect, useState } from 'react';
import {
  createTicket,
  getTicketStats,
  listTickets,
  updateTicket,
} from './api/tickets.js';

const STATUSES = ['open', 'in_progress', 'closed'];
const PRIORITIES = ['low', 'medium', 'high'];

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium',
};

function formatStatus(value) {
  return value.replaceAll('_', ' ');
}

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function refresh(nextPage = page, nextStatus = statusFilter) {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        listTickets({
          status: nextStatus || undefined,
          page: nextPage,
          limit: 10,
        }),
        getTicketStats(),
      ]);
      setTickets(listResult.data || []);
      setMeta(listResult.meta || { page: 1, limit: 10, total: 0, totalPages: 0 });
      setStats(statsResult.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh(page, statusFilter);
  }, [page, statusFilter]);

  async function handleCreate(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    setError('');
    try {
      await createTicket({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
      });
      setForm(emptyForm);
      setPage(1);
      await refresh(1, statusFilter);
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id, status) {
    setError('');
    try {
      await updateTicket(id, { status });
      await refresh(page, statusFilter);
    } catch (err) {
      setError(err.message || 'Failed to update ticket');
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">LODWARE</h1>
        <p className="lede">
          Mini ticket tracker — create support tickets, filter by status, and
          move work forward.
        </p>
      </header>

      {stats && (
        <div className="stats" aria-label="Ticket stats">
          {STATUSES.map((status) => (
            <div className="stat" key={status}>
              <strong>{stats[status] ?? 0}</strong>
              <span>{formatStatus(status)}</span>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="layout">
        <section className="panel">
          <h2>New ticket</h2>
          <form onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Brief summary"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Optional details"
              />
            </div>
            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create ticket'}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Tickets</h2>
          <div className="toolbar">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="loading">Loading tickets…</p>
          ) : tickets.length === 0 ? (
            <p className="empty">No tickets yet.</p>
          ) : (
            <div className="list">
              {tickets.map((ticket) => (
                <article className="ticket" key={ticket.id}>
                  <div className="ticket-top">
                    <div>
                      <h3>{ticket.title}</h3>
                      {ticket.description ? <p>{ticket.description}</p> : null}
                      <div className="meta">
                        <span className={`badge ${ticket.status}`}>
                          {formatStatus(ticket.status)}
                        </span>
                        <span className={`badge ${ticket.priority}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="status-control">
                      <label htmlFor={`status-${ticket.id}`}>Status</label>
                      <select
                        id={`status-${ticket.id}`}
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value)
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="pager">
              <button
                className="btn btn-ghost"
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                className="btn btn-ghost"
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
