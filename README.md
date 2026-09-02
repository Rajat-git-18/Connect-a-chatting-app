# Connect

A full-stack social messaging application built with React Native and TypeScript, backed by a Node.js / Express API and PostgreSQL with Prisma.

> 🚧 **Status: Active development** — authentication, connections, conversations, direct messaging, real-time chat events, and core social/thread flows are implemented. Testing, production hardening, and deployment are still in progress.

## Why this project

Connect is a personal engineering project focused on building a production-minded mobile social experience while keeping the backend architecture clean and independently deployable.

The project is structured as separate mobile and backend applications so the client, API, real-time layer, and data layer can evolve independently.

## Current status

### Completed

- Authentication flow
- Secure client-side token storage
- Mobile navigation with Expo Router
- Home/feed experience
- Thread and discussion flows
- User profiles and profile editing
- Connection requests and accepted connections
- Direct conversation creation and conversation list
- Paginated message history
- Sending and receiving direct messages
- Read/unread conversation state
- Real-time message delivery with Socket.IO
- Real-time conversation list updates
- Typing indicators
- Online/offline presence
- Request validation with Zod
- Server-state management with TanStack Query
- Client state management with Zustand

### In progress

- Automated tests
- Production hardening
- Loading, empty and error-state refinement
- Deployment

## Messaging

Connect now includes a complete direct messaging foundation for connected users.

The messaging flow includes:

- One-to-one conversations between connected users
- Conversation inbox with latest-message previews and unread counts
- Cursor-based pagination for message history
- Message sending with server-side persistence
- Read receipts / conversation read state
- Real-time new-message events
- Real-time conversation/inbox updates
- Typing start/stop events
- Online/offline presence tracking
- Socket authentication using the user's access token
- Client-side cache updates for real-time events

Messaging is intentionally restricted to users who are connected, with authorization enforced by the backend before conversations and messages are accessed or created.

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
- Socket.IO Client
- Expo Secure Store
- Reanimated

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Socket.IO
- JWT authentication
- bcrypt
- Zod

## Architecture

```text
React Native / Expo mobile app
            │
      ┌─────┴─────┐
      │            │
   REST API    Socket.IO
      │            │
      ▼            ▼
 Node.js + Express + real-time layer
            │
            ▼
          Prisma
            │
            ▼
       PostgreSQL
```

The REST API handles authentication, conversations, message history, message creation, and read state. Socket.IO provides real-time message, conversation, typing, and presence events. The mobile client integrates both through feature-specific hooks and cache/state management.

## Repository structure

```text
Connect-a-chatting-app/
├── mobile/      # React Native / Expo application
├── backend/     # Node.js / Express API and Socket.IO server
├── design/      # Design resources
├── docs/        # Documentation
└── specs/       # Product specifications
```

## Roadmap

- [x] Authentication
- [x] Mobile navigation
- [x] Home/feed UI
- [x] Thread and discussion UI
- [x] Connections and connection requests
- [x] Direct conversations
- [x] Direct messaging
- [x] Real-time chat events
- [x] Typing indicators and presence
- [x] Read/unread conversation state
- [ ] Automated tests
- [ ] Improve loading, empty and error states
- [ ] Production hardening
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
- Input validation and authorization
- Secure authentication and token handling
- Clear client/server separation
- REST + real-time communication boundaries
- Predictable server-state management
- Real-time cache synchronization
- Maintainable API and database boundaries
- Reliable loading, error and empty states
- Testability and production hardening

## Status

This is an active personal project and is **not yet production-complete**. Major implemented features are reflected in the roadmap above, and the README will continue to evolve as testing, hardening, and deployment work progresses.

## License

No open-source license has been added yet. Until a license is explicitly added, assume the source is available for viewing but not licensed for unrestricted reuse.
