# Community Forums – Fullstack App

Built with **Next.js**, **React**, **Prisma**, and **PostgreSQL**, currently using mocked frontend data and local session for prototyping.

---

## ✨ Features

-   🧵 Create, edit, and delete forums
-   💬 Post and delete comments
-   📋 Forum metadata (tags, timestamp)
-   🎨 Responsive UI using Tailwind CSS + Lucide icons

---

## 🧰 Tech Stack

| Layer    | Tech                            |
| -------- | ------------------------------- |
| Frontend | Next.js (React)                 |
| Styling  | Tailwind CSS                    |
| Icons    | Lucide React                    |
| Backend  | Next.js API Routes              |
| ORM      | Prisma                          |
| Database | PostgreSQL (via Docker Compose) |
| Auth     | NextAuth.js (Google Provider)   |
| Language | TypeScript                      |

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/community-forums.git
cd community-forums
```

---

### 2. Setup Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/community_forums"
NEXTAUTH_SECRET=super-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, go to:

-   [Google Cloud Console](https://console.cloud.google.com/)
-   Create a new project → APIs & Services → Credentials → OAuth 2.0 Client ID
-   Add authorized URIs like: `http://localhost:3000/api/auth/callback/google`

---

### 3. Start PostgreSQL via Docker

```bash
docker-compose up -d
```

This will spin up a PostgreSQL server on port `5450`.

---

### 4. Set Up Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates the necessary tables.

---

### 5. Run the Development Server

```bash
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)
