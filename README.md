# Claude Chat UI

> Two-mode chat page that talks to a Claude-backed FastAPI service. **General Chat** is a stateless book assistant; **Book Recommendations** sends the conversation to the context-aware endpoint that knows your library. Mode toggle clears history so the two contexts don't bleed.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Backend: [claude-rag-recommendations](https://github.com/Auth3nticAI/claude-rag-recommendations)

---

![personalized recommendation citing actual library books](screenshots/chat-recommendation-reply.png)

## What's interesting

- **Two modes via a segmented control** — toggling between General Chat and Book Recommendations clears the conversation so the assistant doesn't carry irrelevant history across contexts.
- **Conversation history held in client state** and round-tripped on every turn, so the assistant has full context without server-side session storage.
- **Auto-scroll** + bouncing "Thinking…" bubble while the request is in flight.
- **User messages right-aligned blue**, assistant messages left-aligned slate, whitespace-preserved for the multi-line replies Claude tends to return.

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind 4
- `NEXT_PUBLIC_API_URL` env var for the API base
- No state library — `useState` + `useRef` for the message scroll container

## Run

```bash
# Backend must be running on :8000 first

npm install
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local
npm run dev
```

Open http://localhost:3000.

## Background

Built as the Week 5 lab for **CSE552 — Fullstack Software Development in the Age of AI Agents**. Capstone version (with the agent + notes synthesis) lives at [book-tracker-ai](https://github.com/Auth3nticAI/book-tracker-ai).
