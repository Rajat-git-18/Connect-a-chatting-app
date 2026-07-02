# Database Design

## Project

Connect

Version: 1.0

---

# Database

PostgreSQL

ORM: Prisma

---

# Entity Overview

The MVP consists of the following entities:

- User
- Conversation
- ConversationMember
- Message

---

# User

Description

Stores registered user information.

Fields

- id (UUID)
- username (Unique)
- email (Unique)
- passwordHash
- displayName
- profileImage
- bio
- isOnline
- lastSeen
- createdAt
- updatedAt

---

# Conversation

Description

Represents a one-to-one conversation.

Fields

- id
- createdAt
- updatedAt

---

# ConversationMember

Description

Links users with conversations.

Fields

- id
- conversationId
- userId
- joinedAt

---

# Message

Description

Stores all chat messages.

Fields

- id
- conversationId
- senderId
- message
- messageType
- isRead
- createdAt

---

# Relationships

User

↓

ConversationMember

↓

Conversation

↓

Message

---

# Indexes

Unique

- email
- username

Indexes

- senderId
- conversationId
- createdAt

---

# Future Tables

Group

GroupMember

Notification

FriendRequest

Media

RefreshToken

Device