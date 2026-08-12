# LODWARE Ticket Tracker — Backend

Express API with clean architecture and PostgreSQL.

## Structure

```
Backend/
├── database/         # PostgreSQL schema SQL
└── src/
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/
    ├── container.js
    └── server.js
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

## API

| Method | Path | Notes |
|--------|------|-------|
| POST | `/tickets` | create |
| GET | `/tickets` | `?status=&page=&limit=` |
| PATCH | `/tickets/:id` | status / priority |
| GET | `/tickets/stats` | counts by status |

Frontend lives in `../Frontend` (`npm run dev` → http://localhost:5173).
