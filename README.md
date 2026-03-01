# 🚀 Employix — Full Stack SaaS Employee Management Platform

A production-style **full-stack Employee Management SaaS** built with modern web technologies.
Employix replicates real startup dashboards with secure authentication, role-based access, analytics, invites, and a premium glassmorphism UI.

Designed as a **resume-grade + internship-ready** project demonstrating real SaaS architecture.

---

# 🌐 Live Demo

Frontend (Vercel):
https://employix-iota.vercel.app/

> Full backend + OAuth works locally with MongoDB Atlas.

---

# 🧠 What This Project Demonstrates

This is not just a frontend dashboard.
It is a **complete SaaS architecture** including:

* OAuth authentication
* Role-based access (Admin / Employee)
* Invite system
* Analytics dashboard
* Notifications system
* Audit logs
* Secure backend APIs
* MongoDB persistence
* Production UI/UX

Built to simulate how real startups build internal productivity tools.

---

# 👨‍💼 User Roles

## 🛡 Admin

Admin controls the organization.

**Capabilities**

* Invite employees via secure invite link
* Assign tasks
* Track employee productivity
* View analytics dashboard
* Manage notifications
* Audit logs for all actions
* Reset password
* Google OAuth login

---

## 👨‍💻 Employee

Employees interact with assigned work.

**Capabilities**

* Accept tasks
* Mark completed / failed
* View personal dashboard
* Receive notifications
* Google OAuth login
* Password login after first setup
* Invite-based onboarding

---

# ✨ Core Features

## 🔐 Authentication System

* Google OAuth (Admin + Employee)
* Email/password login
* JWT authentication
* Password reset via email flow
* Secure token-based sessions

## 📨 Invite System (Advanced)

* Admin can invite employees
* Secure invite links
* Resend / revoke invites
* Invite validation endpoint
* First-time onboarding flow

## 📊 Analytics Dashboard

* Task completion stats
* Productivity tracking
* Team performance metrics
* Date-range filtering

## 🔔 Notification System

* In-app notifications
* Due-soon reminders
* Mark as read / read all
* Personal notification center

## 🧾 Audit Logs

Tracks:

* Invites
* Task creation
* Password changes
* Authentication events

## 📋 Task Management

Admin:

* Create tasks
* Assign employees
* Track team tasks

Employee:

* Accept tasks
* Complete / fail tasks
* Real-time counters
* Filter & search

---

# 🎨 UI/UX Highlights

* Modern SaaS dashboard design
* Glassmorphism interface
* Animated gradients
* 3D login background (Three.js)
* Responsive layout
* Smooth micro-interactions
* Premium dark theme

Inspired by:
Linear • Notion • Slack • Stripe dashboards

---

# 🛠 Tech Stack

## Frontend

* React.js (Vite)
* Tailwind CSS
* Three.js
* React Three Fiber
* Context API

## Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Google OAuth 2.0

## Dev & Deployment

* Vercel (frontend)
* MongoDB Atlas
* GitHub

---

# 📁 Project Structure

```
Employix
│
├── src/                # Frontend (React)
├── server/             # Backend (Node + Express)
├── public/
├── .env
└── README.md
```

---

# ⚙️ Local Setup (Full Stack)

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sar1thak/EMPLOYIX.git
cd EMPLOYIX
```

---

# 🟢 Backend Setup

```bash
cd server
npm install
```

Create env:

```bash
# Windows
Copy-Item .env.example .env
```

Update `server/.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

# 🔵 Frontend Setup

Open new terminal:

```bash
npm install
```

Create root `.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

# 🔐 OAuth Setup (Google Console)

Create OAuth client → Web application
Add:

### Authorized JS origins:

```
http://localhost:5173
http://localhost:5000
```

### Redirect URI:

```
http://localhost:5000/auth/google/callback
```

Copy client ID & secret into backend `.env`.

---

# 🔄 OAuth Flow

1. User clicks Google login
2. Backend authenticates via Google
3. User stored in MongoDB
4. JWT generated
5. Redirect to frontend with token
6. Role-based dashboard loads

---

# 🔌 API Endpoints (Major)

Auth:

```
GET  /auth/google
GET  /auth/google/callback
POST /auth/local-login
POST /auth/forgot-password
POST /auth/reset-password
```

Tasks:

```
POST /api/tasks
GET  /api/tasks/team
GET  /api/tasks/my
PATCH /api/tasks/:id/status
```

Invites:

```
POST /api/invitations
GET  /api/invitations
POST /api/invitations/:id/resend
POST /api/invitations/:id/revoke
GET  /api/invitations/validate
```

Other:

```
GET /api/analytics/admin
GET /api/notifications/my
GET /api/audit-logs
PUT /api/account/password
```

---

# 🚀 Deployment

Frontend deployed on Vercel.

To deploy:

```bash
npm run build
```

Upload `/dist` to Vercel
OR connect GitHub repo.

For full production:

* Deploy backend on Render/Railway
* Use MongoDB Atlas
* Add env variables

---

# 🧑‍💻 Author

**Sarthak Shukla**
BTech CSE (AI) — KIET
Aspiring Full Stack + AI Engineer

GitHub:
https://github.com/sar1thak

LinkedIn:
https://www.linkedin.com/in/sarthak-shukla-794739298/

---

# ⭐ Why This Project Matters

This project demonstrates:

* Full stack engineering
* Production UI/UX thinking
* Secure authentication
* SaaS architecture design
* Real-world feature implementation

Built as a **resume-grade flagship project** for internships and full-stack roles.

---

# ⭐ Support

If you like this project:

Give it a ⭐ on GitHub
It helps a lot and motivates further development.
