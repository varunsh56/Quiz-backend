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

docker-compose up --build -d 

This will:

Spin up a MySQL container

Build and run the Node.js container

4️⃣ Install Dependencies (If running locally, not Docker)

npm install

5️⃣ Run Migrations & Seeds

npx knex migrate:latest

npx knex seed:run

6️⃣ Start the Development Server

npm run dev

Server will be live at:
http://localhost:4000

# API Documentation  
Swagger API docs are available at [http://localhost:4000/api-docs/#/](http://localhost:4000/api-docs/#/).  


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

📦 Database Schema

The project uses MySQL (via Knex.js migrations) with a clean, normalized design to handle users, quizzes, questions, attempts, and answers.
Here’s the high-level ERD and table details:

🗺️ Entity-Relationship Diagram (ERD)

Users ───< Quizzes ───< Quiz_Questions >─── Questions >─── Skills
   │            │
   │            └──< Quiz_Attempts ───< Quiz_Answers

📝 Table Breakdown

| Table               | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| **users**           | Stores registered users and their roles.        |
| **skills**          | Skill tags/categories for organizing questions. |
| **questions**       | Questions linked to skills with options.        |
| **quizzes**         | A collection of questions created by admins.    |
| **quiz\_questions** | Mapping table between quizzes and questions.    |
| **quiz\_attempts**  | Tracks each user’s attempt on a quiz.           |
| **quiz\_answers**   | Stores answers for each question in an attempt. |


📂 Table Details

1. users

| Column      | Type              | Constraints       |
| ----------- | ----------------- | ----------------- |
| id          | INT (PK)          | Auto-increment    |
| name        | VARCHAR           | NOT NULL          |
| email       | VARCHAR           | NOT NULL, UNIQUE  |
| password    | VARCHAR           | NOT NULL (hashed) |
| role        | ENUM(user, admin) | NOT NULL          |
| created\_at | TIMESTAMP         | Default: `NOW()`  |
| updated\_at | TIMESTAMP         | Default: `NOW()`  |

2. skills

| Column      | Type      | Constraints      |
| ----------- | --------- | ---------------- |
| id          | INT (PK)  | Auto-increment   |
| name        | VARCHAR   | NOT NULL, UNIQUE |
| description | TEXT      |                  |
| created\_at | TIMESTAMP | Default: `NOW()` |

3. questions

| Column         | Type      | Constraints                              |
| -------------- | --------- | ---------------------------------------- |
| id             | INT (PK)  | Auto-increment                           |
| skill\_id      | INT (FK)  | References `skills.id` ON DELETE CASCADE |
| question       | TEXT      | NOT NULL                                 |
| options        | JSON      | NOT NULL (array of possible answers)     |
| correct\_index | INT       | NOT NULL (index of correct answer)       |
| difficulty     | INT       | Default: 1                               |
| created\_at    | TIMESTAMP | Default: `NOW()`                         |

4. quizzes

| Column               | Type      | Constraints                              |
| -------------------- | --------- | ---------------------------------------- |
| id                   | INT (PK)  | Auto-increment                           |
| title                | VARCHAR   | NOT NULL                                 |
| description          | TEXT      |                                          |
| created\_by          | INT (FK)  | References `users.id` ON DELETE SET NULL |
| time\_limit\_minutes | INT       | Optional time limit                      |
| created\_at          | TIMESTAMP | Default: `NOW()`                         |

5. quiz_questions

| Column                         | Type                                    | Constraints                                 |
| ------------------------------ | --------------------------------------- | ------------------------------------------- |
| id                             | INT (PK)                                | Auto-increment                              |
| quiz\_id                       | INT (FK)                                | References `quizzes.id` ON DELETE CASCADE   |
| question\_id                   | INT (FK)                                | References `questions.id` ON DELETE CASCADE |
| position                       | INT                                     | Default: 0                                  |
| unique(quiz\_id, question\_id) | Ensures no duplicate questions per quiz |                                             |

6. quiz_attempts

| Column       | Type      | Constraints                                |
| ------------ | --------- | ------------------------------------------ |
| id           | INT (PK)  | Auto-increment                             |
| user\_id     | INT (FK)  | References `users.id` ON DELETE CASCADE    |
| quiz\_id     | INT (FK)  | References `quizzes.id` ON DELETE SET NULL |
| started\_at  | TIMESTAMP | Default: `NOW()`                           |
| finished\_at | TIMESTAMP | NULLABLE                                   |
| total\_score | INT       | Default: 0                                 |
| meta         | JSON      | Optional extra metadata                    |

7. quiz_answers

| Column          | Type      | Constraints                                     |
| --------------- | --------- | ----------------------------------------------- |
| id              | INT (PK)  | Auto-increment                                  |
| attempt\_id     | INT (FK)  | References `quiz_attempts.id` ON DELETE CASCADE |
| question\_id    | INT (FK)  | References `questions.id` ON DELETE CASCADE     |
| selected\_index | INT       | Index of chosen answer                          |
| score           | INT       | Score awarded                                   |
| answered\_at    | TIMESTAMP | Default: `NOW()`                                |

🔥 Highlights of the Design

Normalization: Questions and skills are separated, avoiding duplication.

Flexibility: meta fields in quiz_attempts allow storing additional data (like time taken per question).

Scalability: Indexed fields for faster queries on user attempts and answers.

Data Integrity: Foreign key constraints with proper CASCADE or SET NULL policies.

Extensible: Easy to add tags, question difficulty levels, or analytics without breaking schema.

