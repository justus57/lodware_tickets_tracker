# LODWARE Ticket Tracker — Backend

Express API with clean architecture and PostgreSQL.

## Structure

```
Backend/src/
├── domain/           # Entities, errors, repository ports
├── application/      # Use cases & DTOs
├── infrastructure/   # Postgres, config, repository adapters
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

API: `http://localhost:3000/api/v1/tickets`
