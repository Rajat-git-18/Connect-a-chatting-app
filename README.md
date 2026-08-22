# Connect

A full-stack messaging application built with React Native and TypeScript, backed by a Node.js / Express API and PostgreSQL with Prisma.

> 🚧 **Status: Active development** — the foundation and core mobile flows are in place while messaging, real-time functionality and production hardening are being completed.

## Why this project

Connect is a personal engineering project focused on building a production-minded mobile experience while keeping the backend architecture clean and independently deployable.

The project is structured as separate mobile and backend applications so the client, API and data layer can evolve independently.

## Current status

### Completed

- Authentication flow
- Secure client-side token storage
- Mobile navigation with Expo Router
- Home/feed experience
- Thread UI foundation
- API foundation
- Request validation with Zod
- Server-state management with TanStack Query
- Client state management with Zustand

### In progress

- Thread backend
- Messaging flows
- Real-time updates
- Tests
- Production hardening
- Deployment

## Tech stack

### Mobile

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- Expo Secure Store
- Reanimated

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT authentication
- bcrypt
- Zod

## Architecture

```text
React Native / Expo mobile app
            │
            ▼
      HTTP / REST API
            │
            ▼
      Node.js + Express
            │
            ▼
          Prisma
            │
            ▼
       PostgreSQL
```

## Repository structure

```text
Connect-a-chatting-app/
├── mobile/      # React Native / Expo application
├── backend/     # Node.js / Express API
├── design/      # Design resources
├── docs/        # Documentation
└── specs/       # Product specifications
```

## Roadmap

- [x] Authentication
- [x] Mobile navigation
- [x] Home/feed UI
- [x] Thread UI foundation
- [ ] Complete thread API
- [ ] Implement messaging
- [ ] Add real-time updates
- [ ] Add automated tests
- [ ] Improve loading, empty and error states
- [ ] Production deployment

## Running locally

### Mobile

```bash
cd mobile
npm install
npm start
```

Use the Expo CLI to launch the app on an emulator or device.

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend requires the project's environment variables and PostgreSQL database configuration. Never commit real credentials, tokens or production secrets.

## Engineering focus

The project is being built with an emphasis on:

- Strong TypeScript boundaries
- Input validation
- Secure authentication and token handling
- Clear client/server separation
- Predictable server-state management
- Maintainable API and database boundaries
- Reliable loading, error and empty states
- Testability and production hardening

## Status

This is an active personal project and is **not yet production-complete**. The README will be updated as major features are completed.

## License

No open-source license has been added yet. Until a license is explicitly added, assume the source is available for viewing but not licensed for unrestricted reuse.
