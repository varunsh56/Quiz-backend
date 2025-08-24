🧠 Quiz Backend API

A secure, scalable, and modular backend service for managing quizzes, users, skills, and reports. Built with Node.js, Express, Knex.js, and MySQL and containerized with Docker for easy setup.

🚀 Features

✅ Modular Node.js architecture (Routes, Controllers, Services)
✅ Secure JWT-based authentication
✅ Scalable MySQL schema with migrations and seeds
✅ Dockerized for quick local setup

🛠️ Tech Stack

Runtime: Node.js (Express.js)
Database: MySQL + Knex.js ORM
Auth: JWT (JSON Web Tokens)
Containerization: Docker & Docker Compose
Environment: dotenv

⚙️ Setup & Installation

1️⃣ Clone Repository
git clone https://github.com/varunsh56/Quiz-backend.git
cd quiz-backend

2️⃣ Setup Environment Variables
PORT=4000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=quiz_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

3️⃣ Start Services with Docker
docker-compose up --build

This will:
Spin up a MySQL container
Build and run the Node.js container

4️⃣ Install Dependencies (If running locally, not Docker)
npm install

5️⃣ Run Migrations & Seeds
# Run migrations
npx knex migrate:latest

# Seed initial data
npx knex seed:run

6️⃣ Start the Development Server
npm run dev

Server will be live at:
http://localhost:4000

🔑 API Authentication
All protected routes require a Bearer Token:
Authorization: Bearer <USER_TOKEN>

📡 Example API Calls (cURL)
Submit Quiz Attempt
curl -X POST http://localhost:4000/api/attempts/submit \
 -H "Authorization: Bearer $USER_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{
   "attempt_id": 123,
   "answers": [
     {"question_id": 1, "selected_index": 0},
     {"question_id": 2, "selected_index": 2}
   ]
 }'

End Quiz Attempt
curl -X POST http://localhost:4000/api/attempts/end \
 -H "Authorization: Bearer $USER_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"attempt_id": 123}'

🧩 Available Routes Overview
| Method | Endpoint               | Description            | Auth Required |
| ------ | ---------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/register`   | Register new user      | ❌             |
| POST   | `/api/auth/login`      | Login & get token      | ❌             |
| GET    | `/api/users`           | Get all users          | ✅             |
| GET    | `/api/skills`          | List all skills        | ✅             |
| GET    | `/api/questions/:id`   | Get question by ID     | ✅             |
| POST   | `/api/attempts/start`  | Start a quiz attempt   | ✅             |
| POST   | `/api/attempts/submit` | Submit attempt answers | ✅             |
| POST   | `/api/attempts/end`    | End a quiz attempt     | ✅             |
| GET    | `/api/reports/:id`     | Get report for attempt | ✅             |

