# LODWARE Ticket Tracker — Backend

Express API with clean architecture and PostgreSQL.

## Structure

```
Backend/
├── database/         # PostgreSQL schema SQL files
└── src/
    ├── domain/           # Entities, errors, repository ports
    ├── application/      # Use cases & DTOs
    ├── infrastructure/   # Postgres pool, migrations, repositories
    ├── presentation/     # Express app, routes, controllers
    ├── container.js      # Dependency wiring
    └── server.js         # Entry point
```

## Setup

1. Create Postgres DB `lodware_tickets`
2. Copy `.env.example` → `.env` and adjust credentials
3. Install and run:

```bash
cd Backend
npm install
npm run db:migrate
npm run dev
```

API:

| Method | Path | Notes |
|--------|------|-------|
| POST | `/tickets` | create |
| GET | `/tickets` | `?status=&page=&limit=` |
| PATCH | `/tickets/:id` | status / priority |
| GET | `/tickets/stats` | counts by status |

If you already created the DB with the old schema, drop and recreate the `tickets` table (or the database) before migrating.
