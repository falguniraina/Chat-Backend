# Chat Backend

A backend application for a chat system built using **Node.js, TypeScript, Express.js, PostgreSQL, and Firebase Firestore**.

The application supports one-to-one chat creation, message sending and retrieval, read receipts, last-seen tracking, and fetching a user's chat list.

## Features

- **Create Chat:** Create or retrieve an existing one-to-one conversation between two users.
- **Send Messages:** Store chat messages in Firebase Firestore.
- **Get Messages:** Retrieve messages from a conversation with pagination using a configurable limit.
- **Read Receipts:** Record when a user reads a message.
- **Last Seen:** Track the last message seen by a user in a conversation.
- **User Chats:** Retrieve all conversations associated with a user, including chat members' details.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| TypeScript | Type-safe development |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Firebase Firestore | Message and chat activity storage |
| Firebase Admin SDK | Server-side Firebase integration |
| pg | PostgreSQL database connectivity |
| dotenv | Environment variable management |

## Project Architecture

The project follows a layered architecture to separate responsibilities and improve maintainability.

```text
src/
├── config/
│   ├── database.ts
│   └── firebase.ts
├── controllers/
│   ├── chat.controller.ts
│   ├── message.controller.ts
│   └── user.controller.ts
├── repositories/
│   ├── chat.repository.ts
│   ├── message.repository.ts
│   └── user.repository.ts
├── services/
│   ├── chat.service.ts
│   ├── message.service.ts
│   └── user.service.ts
├── routes/
│   ├── chat.routes.ts
│   └── user.routes.ts
├── middleware/
│   ├── error.middleware.ts
│   └── validation.middleware.ts
├── types/
│   └── index.ts
├── app.ts
└── server.ts
```

## Database Design

### PostgreSQL

PostgreSQL is used to manage relational data.

**Tables:**

- `users` – Stores user information.
- `chats` – Stores chat information and one-to-one conversation details.
- `chat_members` – Maintains the relationship between users and chats.

A unique constraint on the user pair prevents duplicate one-to-one conversations.

### Firebase Firestore

Firestore is used to store chat messages and message-related activity.

**Firestore structure:**

```text
chats/
  {chatId}/
    messages/
      {messageId}/
        readReceipts/
          {userId}

    lastSeen/
      {userId}
```

Each message stores information such as its ID, sender ID, message text, and creation timestamp.

## API Endpoints

Base URL:

```text
http://localhost:5000
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat/create` | Create or retrieve a one-to-one chat |
| POST | `/chat/:chatId/message/send` | Send a message |
| GET | `/chat/:chatId/messages` | Retrieve chat messages |
| POST | `/chat/:chatId/message/:messageId/read` | Mark a message as read |
| POST | `/chat/:chatId/lastseen` | Update user's last-seen message |
| GET | `/user/:userId/chats` | Retrieve all chats for a user |

### Get Messages

Example:

```http
GET /chat/{chatId}/messages?limit=50
```

The `limit` query parameter controls the maximum number of messages returned.

### Get User Chats

Example:

```http
GET /user/{userId}/chats
```

Returns the user's conversations along with chat member details.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- A Firebase project with Cloud Firestore enabled

### 1. Clone the Repository

```bash
git clone https://github.com/falguniraina/Chat-Backend.git
```

### 2. Navigate to the Project

```bash
cd Chat-Backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

Update the PostgreSQL connection details according to your local database configuration.

### 5. Configure Firebase

1. Create a Firebase project.
2. Enable Cloud Firestore.
3. Generate a Firebase Admin SDK service account key.
4. Save the downloaded JSON file as `serviceAccountKey.json` in the project root.

**Important:** Never commit your Firebase service account key or `.env` file to GitHub.

### 6. Set Up PostgreSQL

Create the required database and configure the following tables:

- `users`
- `chats`
- `chat_members`

Ensure the database schema and constraints are configured before starting the application.

### 7. Start the Server

```bash
npm run dev
```

The server will start at:

```text
http://localhost:5000
```

## API Testing

All six API endpoints were tested using **Postman**.

Testing covered:

- Creating and retrieving one-to-one chats.
- Sending and fetching messages.
- Recording message read receipts.
- Updating last-seen information.
- Retrieving a user's chat list with member details.

## Security and Configuration

- Environment variables are used for application configuration.
- Firebase service account credentials are kept outside version control.
- Database queries use parameterized SQL queries.
- Chat membership is checked before performing message-related operations.

## Author

**Falguni Raina**

GitHub: [falguniraina](https://github.com/falguniraina)

**Repository:** [Chat-Backend](https://github.com/falguniraina/Chat-Backend)