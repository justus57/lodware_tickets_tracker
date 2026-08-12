# LODWARE Ticket Tracker

Mini support-ticket tracker with a Node.js/Express + PostgreSQL API and a React UI.

![LODWARE Ticket Tracker UI](docs/ui-screenshot.png)

## Features

- Create tickets with title, description, and priority
- List tickets with status and priority
- Filter by status and paginate results
- Change an existing ticket’s status
- View ticket counts grouped by status

## Tech stack

| Layer | Choice |
|-------|--------|
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Frontend | React (Vite) |

## Setup

### 1. Database

Create a PostgreSQL database (or use an existing one), then set credentials in `Backend/.env`:

```bash
cd Backend
cp .env.example .env
```

Example:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=postgres
```

Run migrations:

```bash
npm install
npm run db:migrate
```

### 2. Backend

```bash
cd Backend
npm run dev
```

API: `http://localhost:3000`

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

UI: `http://localhost:5173`  
Vite proxies `/tickets` to the backend.

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/tickets` | Create a ticket |
| `GET` | `/tickets` | List tickets (`?status=&page=&limit=`) |
| `PATCH` | `/tickets/:id` | Update status or priority |
| `GET` | `/tickets/stats` | Counts grouped by status |

## Project structure

```
├── Backend/     # Clean-architecture Express API + SQL schema
├── Frontend/    # React (Vite) single-page UI
└── docs/        # Screenshots and docs assets
```

## Decisions & Tradeoffs

Clean architecture keeps domain rules separate from Express and Postgres so the API stays easy to reason about and test. Ticket fields match the assignment closely (`open | in_progress | closed`, `low | medium | high`) instead of adding extra workflow states. The UI is a single page covering create, list, filter, and status updates—no auth, routing, or design system, since the brief asked not to over-build. Vite proxies API calls in development to avoid CORS friction. Schema SQL lives in `Backend/database/` and is applied on startup/migrate. With more time, I’d add dedicated integration tests for create/list/stats, a separate app database instead of the default `postgres` DB, and tighter input validation/error UX on the frontend.
