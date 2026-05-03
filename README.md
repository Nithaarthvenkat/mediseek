# MediSeek 🏥
### Tamil Nadu Hospital Ranking & Smart Finder System

A full-stack web application that ranks 58 hospitals across Tamil Nadu based on 8 quality metrics, features a symptom-aware Smart Hospital Finder with severity assessment, dedicated specialist hospital highlighting, and MongoDB-backed user authentication.

---

## 📁 Project Structure

```
mediseek/
├── server.js                  ← Express entry point
├── package.json               ← Dependencies
├── .env                       ← Environment config (not committed to git)
├── .gitignore
│
├── config/
│   └── db.js                  ← MongoDB connection
│
├── models/
│   └── User.js                ← Mongoose schema + bcrypt hashing
│
├── routes/
│   └── auth.js                ← REST API: /register /login /logout /me /profile
│
└── public/                    ← Frontend (served as static files)
    ├── index.html             ← Single-page app (Login + Dashboard)
    ├── css/
    │   └── style.css          ← All styles
    └── js/
        ├── main.js            ← All frontend logic
        └── hospitals.json     ← 58 TN hospital records
```

---

## 🚀 Setup & Run

### Prerequisites
- [Node.js v18+](https://nodejs.org)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) *(optional, for viewing data)*

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/mediseek.git
cd mediseek

# 2. Install dependencies
npm install

# 3. Make sure MongoDB is running
# Windows:  net start MongoDB
# macOS:    brew services start mongodb-community
# Linux:    sudo systemctl start mongod

# 4. Start the server
npm start

# For development with auto-restart:
npm run dev
```

### 5. Open the app
Visit **http://localhost:3000**

---

## 🗄️ View Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://127.0.0.1:27017`
3. Open: `mediseek` → `users`
4. You'll see all registered users with hashed passwords, timestamps, and login history

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account (stores bcrypt hash in MongoDB) |
| `POST` | `/api/auth/login` | Sign in + record login history |
| `POST` | `/api/auth/logout` | Destroy session |
| `GET`  | `/api/auth/me` | Restore session on page refresh |
| `PUT`  | `/api/auth/profile` | Update name |

---

## ✨ Features

- **Login & Register** — Username + Email + Password. bcrypt hashing. Session persists 7 days.
- **Smart Hospital Finder** — Select city + symptoms (free text or 38 quick-select pills). Severity assessment (Mild / Moderate / Urgent / Immediate). Dedicated specialist hospitals highlighted with ⭐ gold badge.
- **Dedicated Specialist Hospitals** — Hospitals that exist solely for one speciality (eye, cancer, heart, ortho, kidney, psychiatry, pediatrics) are always surfaced first with gold border and badge.
- **Hospital Rankings** — 58 TN hospitals sorted by composite quality score. Filter by type, city, certification, speciality.
- **Compare** — Side-by-side comparison of any two hospitals.
- **Analytics** — Bar charts, donut chart, accreditation coverage, city rankings.
- **Interactive Map** — Google Maps embed with 8 city-cluster buttons.
- **Live Search** — Navbar search opens hospitals in Google Maps directly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | bcryptjs, express-session |
| Data | hospitals.json (58 TN hospitals) |

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mediseek
SESSION_SECRET=your_secret_key_here
```

---

## 👥 Team

Software Engineering Project — Dept. of Computer Science & Engineering
