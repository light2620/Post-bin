# Pastebin Lite

A lightweight Pastebin-like application to create, share, and view text snippets with optional expiration by time or number of views.

---

## Features
- Create and share pastes via unique URLs
- Optional auto-expiry (time-based or view-based)
- View count tracking
- Minimal, clean UI
- Production-ready backend with concurrency-safe logic

---

## Tech Stack
- **Frontend:** Vite, React, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon)
- **Deployment:** Vercel

---

## Persistence Layer
PostgreSQL is used to store pastes with metadata such as expiration time, maximum views, view count, and soft-delete status.  
Atomic database updates ensure correctness under concurrent access.

---

## Key Design Decisions
- **Atomic GET logic** to safely handle view counting and expiry
- **Soft deletes** using an `is_deleted` flag
- **Environment-based configuration** for local and production setups
- **SPA routing rewrites** for correct deep-link handling on Vercel

---

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev
```

**server/.env**
```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgres://user:password@localhost:5432/pastebin
```

---

### Frontend
```bash
cd client
npm install
npm run dev
```

**client/.env**
```env
VITE_API_BASE_URL=http://localhost:4000/api/paste
```

Frontend runs at `http://localhost:5173`.

---

## API Documentation

### Create Paste
**POST** `/api/paste`

**Request Body**
```json
{
  "content": "Hello world",
  "expiresIn": 60,
  "maxViews": 2
}
```

**Response**
```json
{
  "id": "abc123",
  "url": "/paste/abc123"
}
```

---

### Get Paste
**GET** `/api/paste/:id`

**Success (200)**
```json
{
  "content": "Hello world",
  "viewsLeft": 1,
  "expiresAt": "2026-01-12T10:00:00.000Z"
}
```

**Expired (410)**
```json
{
  "error": "Paste expired"
}
```

**Not Found (404)**
```json
{
  "error": "Not found"
}
```

---

## Environment Variables

### Frontend
- `VITE_API_BASE_URL`

### Backend
- `PORT`
- `FRONTEND_URL`
- `DATABASE_URL`

---

## Notes
- Designed to pass automated tests
- No external UI libraries
- Deterministic backend behavior
