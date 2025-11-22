# Learning Roadmap & Quiz Platform API

## Overview
The **Learning Roadmap & Quiz Platform API** is a modern, secure RESTful backend service built with **Node.js, Express.js, MongoDB, and Mongoose**. It powers a complete structured learning experience where users can follow curated roadmaps (with sections and resources), take ranked quizzes, track their progress, and earn grades — all while admins manage content seamlessly.

This API uses **JWT authentication stored in HTTP-only cookies** for security, includes role-based access control (user/admin), and features progress tracking for both roadmaps and quizzes. It's fully production-ready with security middleware, rate limiting, input sanitization, and clean error handling.

Deployed example (when live): `https://roadmap-project-chi.vercel.app/api/v1`  
Includes full Postman collection support for testing.

## Features

* User Authentication: Secure signup, login, logout, profile management with JWT in HTTP-only cookies.
* Roadmap System: Create hierarchical learning paths → Roadmap → Sections → Resources (videos, articles, courses).
* Progress Tracking: Users can mark sections as complete; progress saved per roadmap.
* Quiz Engine: Full-featured quizzes with multiple-choice questions, ranked difficulty, answer submission, scoring, grading, and attempt history.
* Admin Panel: Full CRUD for roadmaps, sections, resources, quizzes, and user management (toggle admin role).
* Profile Management: Update bio, username, upload profile picture.
* Security-First: Helmet, rate limiting, MongoDB injection protection, XSS sanitization.
* Scalable & Clean: Built with best practices, modular routes, middleware, and error handling.

## Tech Stack

* Framework: Node.js with Express.js
* Database: MongoDB (Atlas or local) + Mongoose ODM
* Authentication: JSON Web Tokens (JWT) in HTTP-only cookies
* File Upload: Multer (profile images)
* Security: helmet, express-rate-limit, mongo-sanitize, xss-clean
* API Testing: Postman ready
* Deployment: Vercel, Render, Railway, or any Node.js host

## Prerequisites
To run the API locally, ensure you have:

* Node.js: v18.x or higher
* MongoDB: Local or MongoDB Atlas
* Git
* Postman (recommended for testing)
* Code Editor (e.g., VS Code)

## Installation
Follow these steps to set up and run the API locally:

1. Clone the Repository:
   ```bash
   git clone https://github.com/aliMohamed2345/roadmap-project-api
   cd learning-roadmap-quiz-api
   Install Dependencies:Bashnpm install
Create Environment Variables:
Create a .env file in the root directory and add the following:envPORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/roadmap_quiz_db
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/roadmap_quiz_db

JWT_SECRET=your_very_long_and_secure_random_secret_here_2025
JWT_EXPIRE=30d
NODE_ENV=developmentTip: Generate a strong JWT_SECRET using node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
Start MongoDB:
Local: Make sure MongoDB is running (mongod command or MongoDB service)
Atlas: Just ensure your MONGO_URI is correct and your IP is whitelisted

Run the Application:Bash# Development (with auto-restart)
npm run dev

# Or production mode
npm startServer will start at: http://localhost:5000
Test the API:
Open your browser or use curl/Postman:Bashcurl http://localhost:5000/→ Should return:JSON{ "message": "Server is running 🚀" }
API Base URL:
All endpoints are under:texthttp://localhost:5000/api/v1Example:
Register: POST http://localhost:5000/api/v1/auth/signup
Get roadmaps: GET http://localhost:5000/api/v1/roadmap
## API Endpoints

**Base URL:**  
`http://localhost:5000/api/v1` (local) • `https://roadmap-project-chi.vercel.app/api/v1/roadmap` (production)

All protected routes require a valid **JWT** stored in an **HTTP-only cookie** (automatically set after `/auth/login` or `/auth/signup`).

### Authentication

| Method | Endpoint          | Description              | Request Body Example                                                                 | Response Example                          |
|--------|-------------------|--------------------------|--------------------------------------------------------------------------------------|-------------------------------------------|
| POST   | `/auth/signup`    | Register new user        | `{ "username": "alex", "email": "alex@example.com", "password": "123456" }`         | Sets JWT cookie + user object             |
| POST   | `/auth/login`     | Login user               | `{ "email": "alex@example.com", "password": "123456" }`                             | Sets JWT cookie + user object             |
| POST   | `/auth/logout`    | Logout (clears cookie)   | —                                                                                    | `{ "message": "Logged out successfully" }` |

### Users

| Method | Endpoint                               | Description                          | Access     |
|--------|----------------------------------------|--------------------------------------|------------|
| GET    | `/users/profile`                       | Get own profile                      | Auth       |
| PUT    | `/users/profile`                       | Update username, email, bio          | Auth       |
| PUT    | `/users/profile/change-password`       | Change password                      | Auth       |
| PUT    | `/users/profile/upload-image`          | Upload profile picture (multipart/form-data) | Auth |
| GET    | `/users`                               | Get all users (admin only)           | Admin      |
| PUT    | `/users/:id/role`                      | Toggle admin role                    | Admin      |

### Roadmaps

| Method | Endpoint                  | Description                       | Access  |
|--------|---------------------------|-----------------------------------|---------|
| GET    | `/roadmap`                | Get all roadmaps                  | Public  |
| POST   | `/roadmap`                | Create new roadmap                | Admin   |
| GET    | `/roadmap/:id`            | Get roadmap with sections         | Public  |
| PUT    | `/roadmap/:id`            | Update roadmap                    | Admin   |
| DELETE | `/roadmap/:id`            | Delete roadmap                    | Admin   |
| GET    | `/roadmap/:id/progress`   | Get current user's progress       | Auth    |

#### Sections (nested under roadmap)

| Method | Endpoint                                        | Description                   | Access |
|--------|-------------------------------------------------|-------------------------------|--------|
| GET    | `/roadmap/:id/sections`                         | List all sections             | Public |
| POST   | `/roadmap/:id/sections`                         | Create new section            | Admin  |
| GET    | `/roadmap/:id/sections/:sectionId`              | Get single section            | Public |
| PUT    | `/roadmap/:id/sections/:sectionId`              | Update section                | Admin  |
| DELETE | `/roadmap/:id/sections/:sectionId`              | Delete section                | Admin  |
| POST   | `/roadmap/:id/sections/:sectionId/complete`     | Toggle section completion     | Auth   |

#### Resources (nested under section)

| Method | Endpoint                                                   | Description              | Access |
|--------|------------------------------------------------------------|--------------------------|--------|
| GET    | `/roadmap/:id/sections/:sectionId/resources`               | List resources           | Public |
| POST   | `/roadmap/:id/sections/:sectionId/resources`               | Create resource          | Admin  |
| GET    | `/roadmap/:id/sections/:sectionId/resources/:resourceId`   | Get single resource      | Public |
| PUT    | `/roadmap/:id/sections/:sectionId/resources/:resourceId`   | Update resource          | Admin  |
| DELETE | `/roadmap/:id/sections/:sectionId/resources/:resourceId`   | Delete resource          | Admin  |

### Quizzes

| Method | Endpoint                  | Description                       | Access  |
|--------|---------------------------|-----------------------------------|---------|
| GET    | `/quiz`                   | Get all quizzes                   | Public  |
| POST   | `/quiz`                   | Create new quiz                   | Admin   |
| GET    | `/quiz/:id`               | Get quiz with questions           | Public  |
| PUT    | `/quiz/:id`               | Update quiz                       | Admin   |
| DELETE | `/quiz/:id`               | Delete quiz                       | Admin   |

#### Questions & Quiz Taking

| Method | Endpoint                                   | Description                              | Access |
|--------|--------------------------------------------|------------------------------------------|--------|
| POST   | `/quiz/:quizId/questions`                  | Add new question                         | Admin  |
| GET    | `/quiz/:quizId/questions/:questionId`      | Get specific question                    | Auth   |
| PUT    | `/quiz/:quizId/questions/:questionId`      | Update question                          | Admin  |
| DELETE | `/quiz/:quizId/questions/:questionId`      | Delete question                          | Admin  |
| POST   | `/quiz/:quizId/questions/submit`           | Submit answers → saves score & grade     | Auth   |
| GET    | `/quiz/:quizId/questions/restart`          | Reset user's quiz attempt                | Auth   |
Authorization

JWT stored in HTTP-only cookies (secure, inaccessible to JS)
Admin routes require isAdmin: true
Postman handles cookies automatically after login

Error Handling
All errors follow this format:
JSON{
  "success": false,
  "message": "Detailed error message"
}
Common status codes: 400, 401, 403, 404, 500
Testing with Postman

Import the provided Postman Collection
Set environment variable: base_url = http://localhost:5000/api/v1
Start with /auth/signup or /auth/login
All subsequent requests automatically include JWT cookie
Contributing
Contributions are welcome!

Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit: git commit -m "Add amazing feature"
Push and open a Pull Request

See CONTRIBUTING.md for details.
