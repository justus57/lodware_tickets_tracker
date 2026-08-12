const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error?.message || body?.error || 'Request failed');
  }
  return body;
}

export function listTickets({ status, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);
  return request(`/tickets?${params}`);
}

export function createTicket(payload) {
  return request('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTicket(id, payload) {
  return request(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getTicketStats() {
  return request('/tickets/stats');
}
