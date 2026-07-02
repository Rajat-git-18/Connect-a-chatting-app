# API Specification

## Base URL

/api/v1

---

# Authentication

POST /auth/register

Create new account

---

POST /auth/login

Authenticate user

---

POST /auth/logout

Logout current user

---

GET /auth/me

Get current user

---

# Users

GET /users/search

Search users by username

---

GET /users/:id

Get user profile

---

PATCH /users/profile

Update profile

---

# Conversations

GET /conversations

Get all conversations

---

POST /conversations

Create conversation

---

GET /conversations/:id

Get conversation

---

# Messages

GET /messages/:conversationId

Load messages

---

POST /messages

Send message

---

PATCH /messages/:id/read

Mark message as read

---

# Socket Events

Connection

↓

User Connected

---

Message

↓

Receive Message

---

Typing

↓

Typing Indicator

---

Disconnect

↓

User Offline