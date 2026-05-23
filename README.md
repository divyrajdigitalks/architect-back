# Architect Backend

Node.js + Express + MongoDB MVC backend for Architect Site Management.

## Folder Structure
```
architect-backend/
├── config/         # DB connection
├── controllers/    # Business logic
├── middleware/     # Auth & error handling
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── uploads/        # Site photo uploads
└── server.js       # Entry point
```

## Setup

```bash
npm install
```

Create `.env` file (already created):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/architect_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

```bash
npm run dev   # development
npm start     # production
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET/POST | /api/projects | List / Create projects |
| GET/PUT/DELETE | /api/projects/:id | Get / Update / Delete project |
| PATCH | /api/projects/:id/stage | Update project stage status |
| GET/POST | /api/clients | List / Create clients |
| GET/PUT/DELETE | /api/clients/:id | Get / Update / Delete client |
| GET | /api/users | List users (filter by ?role=&team=) |
| GET/PUT/DELETE | /api/users/:id | Get / Update / Delete user |
| GET/POST | /api/tasks | List / Create tasks |
| GET/PUT/DELETE | /api/tasks/:id | Get / Update / Delete task |
| GET/POST | /api/payments | List / Create payments |
| GET/PUT/DELETE | /api/payments/:id | Get / Update / Delete payment |
| GET/POST | /api/site-updates | List / Create site updates |
| GET/PUT/DELETE | /api/site-updates/:id | Get / Update / Delete site update |
| GET/POST | /api/attendance | List / Mark attendance |
| PUT/DELETE | /api/attendance/:id | Update / Delete attendance |
| GET/POST | /api/messages | Get / Send messages |
| PATCH | /api/messages/mark-read | Mark all as read |
| DELETE | /api/messages/:id | Delete message |
| GET/POST | /api/site-photos | List / Upload photo (multipart/form-data) |
| DELETE | /api/site-photos/:id | Delete photo |

## Auth
All routes (except /api/auth/login and /api/auth/register) require:
```
Authorization: Bearer <token>
```
