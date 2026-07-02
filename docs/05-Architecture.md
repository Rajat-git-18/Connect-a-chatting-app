# Software Architecture

## Project

Connect

Version: 1.0

---

# 1. Architecture Overview

Connect follows a Client-Server Architecture.

The mobile application communicates with the backend through secure REST APIs.

Real-time messaging is handled using Socket.IO.

All application data is stored in PostgreSQL.

---

# 2. Technology Stack

## Mobile

- React Native
- Expo
- TypeScript

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT Authentication
- Bcrypt Password Hashing

## Real-Time Communication

- Socket.IO

## State Management

- Zustand

## API Communication

- TanStack Query

## Storage

- Cloudinary (Future)

---

# 3. High Level Architecture

React Native App

↓

REST API

↓

Node.js Backend

↓

PostgreSQL Database

Real-Time Communication

↓

Socket.IO Server

↓

Connected Clients

---

# 4. Application Layers

Presentation Layer

↓

Business Logic Layer

↓

Data Access Layer

↓

Database Layer

---

# 5. Folder Structure

Mobile

- Components
- Screens
- Navigation
- Services
- Hooks
- Store
- Assets
- Utils

Backend

- Routes
- Controllers
- Services
- Middleware
- Models
- Prisma
- Config
- Utils

---

# 6. Communication Flow

User Action

↓

React Native

↓

REST API

↓

Business Logic

↓

Database

↓

Response

---

Real-Time

User Sends Message

↓

Socket.IO

↓

Backend

↓

Receiver

---

# 7. Authentication Flow

User Login

↓

Validate Credentials

↓

Generate JWT

↓

Return Token

↓

Store Securely

↓

Authenticated Requests

---

# 8. Data Flow

User

↓

Mobile App

↓

Backend API

↓

Database

↓

Response

↓

UI Update

---

# 9. Security

- Password Hashing
- JWT Authentication
- Input Validation
- HTTPS Communication
- Secure API Design

---

# 10. Scalability

The application is designed to support future features such as:

- Group Chat
- Voice Calls
- Video Calls
- Push Notifications
- AI Assistant