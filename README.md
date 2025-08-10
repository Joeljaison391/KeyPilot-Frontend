<h1 style="display: flex; align-items: center;">
  <img src="src/assets/logo.png" alt="KeyPilot Logo" width="48" height="48" style="margin-right: 8px;">
  <span>KeyPilot – Semantic API Gateway with Caching</span>
</h1>

One request, one intent—and KeyPilot routes to the right provider automatically. No key juggling. No endpoint guessing. Faster builds, lower cost.  

— Built for the [Redis AI Challenge 2025](https://dev.to/challenges/redis-2025-07-23)

---

## ✨ What it is (idea in 30 seconds)

KeyPilot uses semantic intent matching to pick the best API template and key. Responses are cached semantically—similar prompts reuse results instantly. You get unified auth, analytics, and a testing playground in one place.

Live demo: `https://smartkeypilot.vercel.app/`

Demo login pattern:

```text
Username: demo + 1–3 digits   (e.g., demo123)
Password: pass + same digits  (e.g., pass123)
```

---

## 🧠 How we use Redis (beyond caching)

KeyPilot leans on Redis as the primary data plane:

- Semantic intent matching (RediSearch + Vector Index)
  - Templates and intents are embedded; we run vector similarity to choose the best template.
  - Example (conceptual):
    ```js
    const results = await redis.ft.search(
      'idx:intents',
      '*=>[KNN 1 @vector $query_vector]',
      { PARAMS: { query_vector } }
    )
    ```

- Intelligent semantic caching (Strings with TTL)
  - Responses are keyed by user + intent hash; similar prompts reuse cached responses.
  - Example:
    ```js
    await redis.setEx(`cache:${userId}:${intentHash}`, 3600, JSON.stringify(apiResponse))
    ```

- API key storage & sessions (Hashes + TTL)
  - Encrypted keys and user sessions live in Redis with auto-expiry for demos.
  - Example:
    ```js
    await redis.hSet(`keys:${userId}:${template}`, { encrypted_key, description, created_at: Date.now() })
    await redis.setEx(`user:${userId}`, 480, JSON.stringify(session))
    ```

- Real-time analytics (Pub/Sub, Streams, Counters, Sorted Sets)
  - Pub/Sub: live request start/completion events
  - Streams: activity timeline and cache hits
  - Counters: daily request counts, tokens
  - Sorted Sets: top intents and trends

---

## 🏆 About the Redis AI Challenge

This project was created for the [Redis AI Challenge 2025](https://dev.to/challenges/redis-2025-07-23) to showcase how Redis can power a semantic API gateway end‑to‑end: vector search for routing, fast caching, ephemeral sessions, and live analytics—without extra databases or brokers.

---

## 🖥️ Run the whole project locally

### 1) Clone (with backend submodule)

```bash
git clone --recurse-submodules https://github.com/Joeljaison391/KeyPilot-Frontend.git
cd KeyPilot-Frontend
# If you forgot --recurse-submodules
git submodule update --init --recursive
```

### 2) Start the backend (Express + Redis)

```bash
cd backend
npm install

# Configure env
cp .env.example .env
# Fill in required values (see backend README for details)

# Start Redis (Docker recommended)
docker-compose up -d redis

# Start backend API
npm run dev
# Backend runs at http://localhost:8080
```

Backend repo (standalone): `https://github.com/Joeljaison391/KeyPilot`

### 3) Start the frontend (Vite + React)

From the project root:

```bash
npm install

# Create a frontend .env and point to your local backend
echo VITE_API_BASE_URL=http://localhost:8080 > .env

npm run dev
# Frontend runs at http://localhost:5173
```

### 4) Log in and test

- Use demo credentials (see above) or your own test user from the backend.
- Add a key: open Dashboard → Add Key → “Use Demo Key” (Gemini path supported in demo).
- Try the Playground tabs: API Proxy, Intent Testing, Cache Inspector, Trends, Feedback. Each panel shows a ready‑to‑copy cURL.

---

## 🧭 Project structure (frontend)

- `src/`
  - `pages/`: `LoginPage`, `Dashboard`, `Playground`, `WelcomePage`
  - `components/`: `AddKeyModal`, `ProxyTester`, `IntentTester`, `CacheInspector`, `IntentTrends`, `FeedbackStats`, `
