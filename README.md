#  Employix — Full Stack Employee Management SaaS Platform

A modern, production-grade **Employee Management SaaS Platform** built with a scalable MERN architecture and Google OAuth authentication.
Employix replicates real-world internal company dashboards used by startups to manage employees, tasks, and analytics.

Designed with **industry-level UI/UX, authentication architecture, and backend systems**, this project demonstrates full-stack engineering capability suitable for internships and production environments.

---

## 🌐 Live Deployment

**Frontend (Vercel)**
https://employix-iota.vercel.app/

**Backend (Render API)**
https://employix-backend.onrender.com

---

## 🧠 Core Overview

Employix is a multi-role SaaS dashboard that enables organizations to:

* Authenticate users securely via Google OAuth or email/password
* Manage employees and tasks
* Track productivity and analytics
* Send invitations and manage onboarding
* Maintain audit logs and notifications
* Handle password recovery and account management

Built to simulate real SaaS systems used by modern startups.

---

# ✨ Key Features

## 🔐 Authentication System

* Google OAuth 2.0 login (Admin & Employee)
* JWT-based session management
* Email/password login support
* Forgot/reset password flow
* Secure token-based authentication
* Role-based access control

---

## 👨‍💼 Admin Dashboard

* Create & assign tasks to employees
* Invite employees via secure token link
* Monitor team productivity
* View analytics dashboard
* Manage employee list
* Notification system
* Audit logs for actions

---

## 👨‍💻 Employee Dashboard

* Accept assigned tasks
* Mark tasks complete/failed
* Real-time task counters
* Personal notifications
* Password management
* Clean SaaS dashboard UI

---

## 📊 Advanced Backend Features

* Invite lifecycle management (create, resend, revoke)
* Audit logging system
* Notification engine
* Secure REST API architecture
* Role-based middleware
* MongoDB schema design with indexing
* Production-ready error handling
* Environment-based config

---

## 🎨 UI/UX Highlights

* Modern SaaS glassmorphism design
* Fully responsive dashboard
* 3D animated login screen (Three.js)
* Smooth micro-interactions
* Clean component architecture
* Production-level layout design

---

# 🛠 Tech Stack

## Frontend

* React.js (Vite)
* Tailwind CSS
* React Router
* Three.js + React Three Fiber
* Context API

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose ODM
* Passport.js (Google OAuth)
* JWT Authentication

## Dev & Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)
* GitHub (Version Control)

---

# 🏗 Architecture

Client (React)
⬇
Express API (Node.js backend)
⬇
MongoDB Atlas (Cloud database)

Authentication flow:
Google OAuth → Backend → JWT → Frontend → Protected Routes

---

# 📂 Project Structure

```
EMPLOYIX/
│
├── src/                    # Frontend React app
├── server/
│   ├── src/
│   │   ├── config/         # Passport & DB config
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── app.js          # Express app
│   │   └── server.js       # Entry point
│   └── .env
│
└── README.md
```

---

# ⚙️ Local Development Setup

## 1. Clone Repository

```
git clone https://github.com/sar1thak/EMPLOYIX.git
cd EMPLOYIX
```

---

## 2. Frontend Setup

```
npm install
npm run dev
```

Create `.env` in root:

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 3. Backend Setup

```
cd server
npm install
npm run dev
```

Create `server/.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

# 🔐 Google OAuth Setup

Create OAuth credentials from Google Cloud Console.

Authorized redirect URI:

```
http://localhost:5000/auth/google/callback
https://employix-backend.onrender.com/auth/google/callback
```

---

# 🚀 Deployment

## Frontend (Vercel)

* Import GitHub repo
* Add env:

```
VITE_API_BASE_URL=https://employix-backend.onrender.com
```

## Backend (Render)

* Create Web Service
* Root directory: `server`
* Start command:

```
node src/server.js
```

Add env variables:

* MONGODB_URI
* JWT_SECRET
* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET
* GOOGLE_CALLBACK_URL
* FRONTEND_URL
* CORS_ORIGIN

---

# 🧪 API Endpoints

### Auth

* `GET /auth/google`
* `POST /auth/local-login`
* `POST /auth/forgot-password`
* `POST /auth/reset-password`

### User

* `GET /api/me`

### Admin

* `POST /api/tasks`
* `GET /api/tasks/team`
* `POST /api/invitations`
* `GET /api/employees`
* `GET /api/analytics/admin`

### Employee

* `GET /api/tasks/my`
* `PATCH /api/tasks/:id/status`

---

# 🧑‍💻 Author

**Sarthak Shukla**
B.Tech CSE (AI) — KIET Group of Institutions

GitHub: https://github.com/sar1thak
LinkedIn: https://www.linkedin.com/in/sarthak-shukla-794739298/

---

# ⭐ Why This Project Matters

This project demonstrates:

* Full-stack production architecture
* OAuth authentication implementation
* Real SaaS dashboard design
* Secure backend engineering
* MongoDB schema design
* Deployment & DevOps understanding

Suitable for:

* Software Engineering Internships
* Full Stack Developer roles
* Startup portfolio projects

---

# 📜 License

This project is built for educational and portfolio purposes.
Feel free to fork and build upon it.

---

# 💬 Feedback

If you found this project useful or inspiring, consider giving it a ⭐ on GitHub.
