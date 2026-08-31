# TaskFlow — Mini Task Management App

TaskFlow is a full-stack web application designed for personal task management. It features secure token-based user authentication, complete CRUD operations for tasks, dynamic filtering, and a clean, responsive user interface built using vanilla web technologies.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication & Security:** JSON Web Tokens (JWT), `bcryptjs` password hashing

---

## ✨ Features

- **Authentication System:** User registration and login with encrypted password storage (`bcrypt`) and JWT authentication.
- **Task Management (CRUD):** Create, read, update, and delete tasks.
- **Quick Status Toggle:** One-click toggle between pending (`todo`/`in-progress`) and completed (`done`) states.
- **Dynamic Filtering:** Filter tasks instantly by status (`todo`, `in-progress`, `done`) and priority (`low`, `medium`, `high`).
- **Data Isolation & Route Protection:** Authenticated API routes ensure users can only access and modify their own tasks.
- **Responsive UI:** Clean, mobile-friendly interface with modal forms and real-time state feedback.

---

## 📁 Project Structure

```text
TaskFlow/
├── config/
│   └── db.js               # MySQL connection pool setup
├── controllers/
│   ├── authController.js   # User registration & login handlers
│   └── taskController.js   # Task CRUD & status update handlers
├── middleware/
│   └── authMiddleware.js   # JWT token verification middleware
├── public/
│   ├── index.html          # Authentication page (Login / Register)
│   ├── dashboard.html      # Task management dashboard
│   ├── style.css           # Styling & responsive design
│   └── app.js              # Frontend API calls & DOM manipulation
├── routes/
│   ├── authRoutes.js       # Authentication endpoints
│   └── taskRoutes.js       # Protected task endpoints
├── .env.example            # Sample environment variables
├── .gitignore              # Files to ignore in Git
├── package.json            # Project dependencies & scripts
├── schema.sql              # Database schema definition
├── server.js               # Express server entry point
└── README.md               # Project documentation

---

🚀 Setup & Installation Instructions
1. Prerequisites
Node.js (v16.0 or higher)

MySQL Server running locally or remotely

2. Clone the Repository
Bash
git clone https://github.com/SST1303/taskflow-app.git
cd TaskFlow

3. Install Dependencies
Bash
npm install

4. Database Setup 
Open MySQL Workbench or MySQL CLI.
Execute the queries inside the schema.sql file provided in the repository to create the database and tables:  
SQL
SOURCE schema.sql;

5. Environment Configuration
Create a .env file in the root folder based on .env.example:  
Bash
cp .env.example .env
Fill in your actual MySQL credentials and JWT secret in .env.

6. Start the Server
Bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
Open your browser and navigate to: http://localhost:5000

---

🔐 Environment Variables (.env.example)
The following environment variables are required to run this application:  
Code snippet :
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taskflow_db
JWT_SECRET=your_jwt_secret_key

---

🗄️ Database Choice & Rationale
Database Chosen: MySQL  
Why MySQL?
Relational Data Integrity: The application relies on a strict 1-to-Many relationship between users and tasks. MySQL enforces data integrity using Foreign Key constraints (user_id referencing users.id) with ON DELETE CASCADE behavior.  
Structured Schema: Tasks have fixed, well-defined attributes (title, status, priority, due_date), making a typed relational schema ideal and reliable.  
ACID Compliance: Ensures consistent and safe transactions for user registration and task operations.

---

⚠️ Known Limitations & Assumptions
Assumptions:
Authentication & Sessions: Authentication uses JSON Web Tokens (JWT) stored in browser localStorage and passed via the Authorization: Bearer <token> header.  
User Privacy & Ownership: Users can only view, create, edit, and delete their own tasks. Authorization is enforced on every database query using the authenticated user ID[cite: 1].  
Status Options: Task progression is constrained to three statuses: todo, in-progress, and done[cite: 1].

---

Limitations:
Token Invalidation: JWTs expire after 24 hours without server-side token blacklisting on logout (logout is handled by clearing the client-side token).
Password Recovery: There is currently no "Forgot Password" or email verification workflow.
File Attachments: Tasks support text descriptions only; media or file attachments are not supported.