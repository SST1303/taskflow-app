# TaskFlow — Mini Task Management App

A full-stack task management web application built with Vanilla JavaScript, Node.js, Express.js, and MySQL.

## Features
- **User Authentication:** Registration and login with password hashing (`bcrypt`) and JWT-based session security.
- **Task Management (CRUD):** Create, view, edit, and delete personal tasks.
- **Quick Status Toggle:** One-click toggle between pending and completed tasks.
- **Filter Support:** Filter tasks dynamically by Status and Priority.
- **Protected Routes:** Strict user isolation ensuring users only access their own tasks.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Database Choice
MySQL was chosen for this project because structured relational schemas fit task management and user ownership logic naturally, ensuring strong data consistency and clean foreign-key cascade behaviors.

## Local Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SST1303/taskflow-app.git
   cd TaskFlow