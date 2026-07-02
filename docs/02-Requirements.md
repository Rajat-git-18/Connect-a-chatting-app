# Software Requirements Specification (SRS)

1. Functional Requirements

2. Non-Functional Requirements

3. User Roles

4. Core Features

5. Out of Scope


//Functional Requirements

## Authentication

- User can register using email.
- User can log in securely.
- User can log out.
- User can reset password.

---

## Profile

- User can upload profile picture.
- User can edit profile.
- User can update display name.
- User can update status.

---

## Contacts

- Search users.
- Send friend request.
- Accept/Reject requests.
- View contacts.

---

## Chat

- One-to-one chat.
- Send text messages.
- Receive messages instantly.
- Read receipts.
- Typing indicator.
- Online/Offline status.

---

## Group Chat

- Create group.
- Add members.
- Remove members.
- Rename group.
- Group image.

---

## Media

- Send images.
- View images.
- Download images.

---

## Notifications

- Push notifications.
- Message notifications.


//Non Functional Requirements

## Performance

- App launch < 3 seconds.
- Message delivery < 500 ms.
- Smooth scrolling.
- Fast image loading.

---

## Security

- JWT Authentication.
- Password encryption.
- Secure APIs.
- HTTPS only.

---

## Scalability

- Support 10,000+ users.
- Modular architecture.
- Easily extendable.

---

## Reliability

- Handle network failures.
- Auto reconnect.
- Retry failed messages.


//Core Features

Authentication

Profile

Contacts

One-to-One Chat

Group Chat

Media Sharing

Notifications



//Out of Scope

Not included in Version 1

- Voice Calls
- Video Calls
- Stories
- Payments
- AI Chat
- Screen Sharing
- Desktop App


User Discovery

Users shall be able to search other users using their registered mobile number.