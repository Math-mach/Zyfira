# ⚡ Asset Maintenance Assistant - Zyfira

A simple and efficient system to help users register, track, and manage maintenance tasks for their assets such as vehicles, machines, and equipment.

---

## 📦 Tech Stack

-   **Frontend**: React + Material UI
-   **Backend**: Node.js + Express + TypeScript
-   **Database**: PostgreSQL
-   **Authentication**: JWT (stored in HTTP-only cookies)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Math-mach/Zyfira.git
cd Zyfira
```

### 2. Install dependencies

Depending on whether it's a monorepo or separate folders, adjust accordingly:

#### Backend

```bash
cd API
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `API` folder with the following content:

```env
PORT=3333
JWT_SECRET=your_secret_key
DATABASE_URL=postgres://user:password@localhost:5432/your_db_name
```

### 4. Set up the database

Make sure PostgreSQL is running and that your database is created.

Then run the migrations:

```bash
npm run init-db
```

### 5. Run the app

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd rontend
npm run dev
```

---

## ✅ Features

-   User registration, login, and secure authentication
-   Create, update, delete, and list assets
-   Register maintenance history and schedule future tasks
-   Dashboard with upcoming and overdue maintenance
-   Maintenance history view and edit

---

## 📁 Project Structure (Example)

```
project-root/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── migrations/
│       ├── routes/
│       ├── scripts/
│   ├── .env
│   ├── index.ts
│   └── knexfile.ts
├── frontend/
│   ├── src/
│   └── public/
├── .gitignore
├── README.md
```
