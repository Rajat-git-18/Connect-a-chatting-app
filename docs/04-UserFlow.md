# User Flow

## Project

Connect

Version: 1.0

---

# 1. App Launch Flow

User opens the application

↓

Splash Screen

↓

Check Authentication Status

↓

If authenticated → Home Screen

Else → Login Screen

---

# 2. Authentication Flow

Login Screen

↓

Enter Email & Password

↓

Validate Input

↓

Authentication Successful

↓

Navigate to Home Screen

If authentication fails

↓

Display Error Message

Remain on Login Screen

---

# 3. Home Flow

Home Screen

↓

Display Recent Conversations

↓

User selects conversation

↓

Open Chat Screen

OR

↓

Tap Search

↓

Navigate to Search Screen

---

# 4. Search User Flow

Search Screen

↓

Enter User Name

↓

Display Matching Users

↓

Select User

↓

Open Chat Screen

If no conversation exists

↓

Create Conversation

↓

Open Chat

---

# 5. Chat Flow

Open Chat

↓

Load Previous Messages

↓

User Types Message

↓

Tap Send

↓

Message Stored

↓

Message Delivered

↓

Receiver Receives Message

↓

Conversation Updated

---

# 6. Profile Flow

Home

↓

Open Profile

↓

Edit Information

↓

Save Changes

↓

Profile Updated

---

# 7. Logout Flow

Settings

↓

Logout

↓

Clear Session

↓

Navigate to Login

---

# 8. Error Flows

No Internet

↓

Display Offline Message

↓

Retry Connection

Authentication Expired

↓

Logout User

↓

Navigate to Login

Server Error

↓

Display Error Message

↓

Retry Request