Pastebin Lite

A lightweight Pastebin-like web application that allows users to create, share, and view text snippets with optional expiration based on time or number of views.

🚀 Features

Create a paste with plain text

Generate a shareable link

View pastes via unique URL

Optional auto-expiry:

By time (in seconds)

By maximum number of views

View count tracking

Automatic expiration handling

Minimal, clean UI

🛠 Tech Stack
Frontend

Vite

React

React Router

Fetch API

Backend

Node.js

Express

PostgreSQL

pg (node-postgres)

Deployment

Vercel (Frontend + API)

Neon (PostgreSQL)

📦 Persistence Layer

The application uses PostgreSQL as its persistence layer.

Database schema (simplified)
CREATE TABLE pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  expires_at TIMESTAMP,
  max_views INTEGER,
  view_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE
);

Why PostgreSQL?

Strong consistency guarantees

Good support for atomic updates

Reliable handling of concurrent requests

Well-suited for expiry and counter-based logic

🧠 Important Design Decisions
1. Atomic GET logic (view counting & expiry)

To ensure correctness under concurrent access and automated tests, the view count increment and expiry checks are handled atomically at the database level.
This avoids race conditions when multiple users access the same paste simultaneously.

2. Soft deletion (is_deleted)

Instead of physically deleting rows, pastes are soft-deleted using an is_deleted flag.
This allows:

Consistent behavior for expired pastes

Easier future extensions (analytics, cleanup jobs)

3. Expiry semantics

Time-based expiry: Paste expires after expires_at

View-based expiry: Paste expires when view_count exceeds max_views

Once expired, a paste can never be accessed again

4. Environment-based configuration

All environment-specific values are controlled via .env files to support:

Local development

Production deployment

Automated testing

5. SPA routing on Vercel

Since the frontend is a Single Page Application, a rewrite configuration is used to ensure routes like /paste/:id work correctly on page refresh.

🧪 How to Run the App Locally
1️⃣ Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Backend setup
cd server
npm install

Create server/.env
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgres://username:password@localhost:5432/pastebin

Start backend
npm run dev


Backend will run on:

http://localhost:4000

3️⃣ Frontend setup
cd client
npm install

Create client/.env
VITE_API_BASE_URL=http://localhost:4000/api/paste

Start frontend
npm run dev


Frontend will run on:

http://localhost:5173

4️⃣ Test locally

Open http://localhost:5173

Create a paste

Copy the generated link

Open it in a new tab

Refresh and verify view-based expiry

🌐 Environment Variables Summary
Frontend (client/.env)
VITE_API_BASE_URL

Backend (server/.env)
PORT
FRONTEND_URL
DATABASE_URL
