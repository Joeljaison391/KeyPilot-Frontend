# KeyPilot: AI API Gateway & Analytics Platform

> **Built for the [Redis AI Challenge 2025](https://dev.to/challenges/redis-2025-07-23)**

KeyPilot is a full-stack AI API gateway and analytics platform, combining a modern React frontend (Vite) with a production-grade Express.js backend powered by Redis for semantic caching, intent analytics, and secure API key management.

---

## 🚀 Project Structure

- **Frontend:** React 18 + Vite (this repo)
- **Backend:** [KeyPilot Backend](https://github.com/Joeljaison391/KeyPilot) (included as a Git submodule in `/backend`)

---

## 🏆 Redis AI Challenge

This project was built for the [Redis AI Challenge 2025](https://dev.to/challenges/redis-2025-07-23), showcasing advanced use of Redis for semantic caching, analytics, and real-time feedback in AI-powered API platforms.

---

## 📦 Getting Started

### 1. Clone the Repository (with Submodules)

```bash
git clone --recurse-submodules https://github.com/Joeljaison391/KeyPilot-Frontend.git
cd KeyPilot-Frontend
```

If you already cloned without submodules:
```bash
git submodule update --init --recursive
```

### 2. Frontend Setup (Vite + React)

```bash
cd KeyPilot-Frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### 3. Backend Setup (Express.js + Redis)

```bash
cd backend
npm install
# Copy and edit .env.example to .env
cp .env.example .env
# Start Redis (Docker recommended)
docker-compose up -d redis
# Start backend server
npm run dev
# Backend runs at http://localhost:8080
```

---

## 📂 Repository Layout

- `/src` — React frontend source code
- `/backend` — Express.js backend (submodule)
- `/public` — Static assets

---

## 📖 Documentation

- Frontend: See `/src` and in-app tour
- Backend: See [`/backend/README.md`](./backend/README.md)

---

