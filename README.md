# Task Management Node.js API

**POSTMAN**:  https://www.postman.com/deepakch05/d2a24ec1-1154-4690-8e51-1a7a841ac211/documentation/5n8xpsi/task-management-api
## Overview 
This project is a Task Management API built with Node.js, Express, and MongoDB. It allows users to register, login, and manage tasks with various statuses and priorities.

### Working
https://drive.google.com/file/d/1Yv68lHGlOS5XT_ABXE-Gnw6dHXxI6GBG/view?usp=sharing

## Tech Stack
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **bcrypt**: Library to hash passwords
- **jsonwebtoken**: Library to work with JSON Web Tokens (JWT)
- **dotenv**: Module to load environment variables
- **cors**: Middleware to enable CORS

## Highlights
- User authentication with JWT
- Password hashing with bcrypt
- CRUD operations for tasks
- Error handling for various HTTP status codes
- Middleware for token authentication

## Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/Deepakchowdavarapu/TaskManager-Backend.git
    cd taskmanager-backend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Create a `.env` file in the root directory and add the following**
    ```
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4. **Start the server**
    ```bash
    npm start
    ```

## Endpoints

### Authentication

#### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Responses**:
    - `201 Created`: User registered successfully
    - `400 Bad Request`: Missing or invalid fields
    - `500 Internal Server Error`: Server issues

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Responses**:
    - `200 OK`: Login successful, returns JWT token
    - `400 Bad Request`: Missing or invalid fields
    - `401 Unauthorized`: No user exists with given email
    - `409 Conflict`: Incorrect password
    - `500 Internal Server Error`: Server issues

### Tasks

#### Create Task
- **URL**: `/tasks`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
    ```json
    {
      "title": "New Task",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2023-12-31"
    }
    ```
- **Responses**:
    - `201 Created`: Task created successfully
    - `400 Bad Request`: Missing or invalid fields
    - `401 Unauthorized`: Unauthorized access
    - `500 Internal Server Error`: Server issues

#### Get All Tasks
- **URL**: `/tasks`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
    - `200 OK`: Returns list of tasks
    - `401 Unauthorized`: Unauthorized access
    - `500 Internal Server Error`: Server issues

#### Get Task by ID
- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
    - `200 OK`: Returns the task
    - `401 Unauthorized`: Unauthorized access
    - `404 Not Found`: Task not found
    - `500 Internal Server Error`: Server issues

#### Update Task
- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
    ```json
    {
      "title": "Updated Task",
      "description": "Updated description",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2023-12-31"
    }
    ```
- **Responses**:
    - `200 OK`: Task updated successfully
    - `400 Bad Request`: Missing or invalid fields
    - `401 Unauthorized`: Unauthorized access
    - `404 Not Found`: Task not found
    - `500 Internal Server Error`: Server issues

#### Delete Task
- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
    - `200 OK`: Task deleted successfully
    - `401 Unauthorized`: Unauthorized access
    - `404 Not Found`: Task not found
    - `500 Internal Server Error`: Server issues

#### Set Task Reminder
- **URL**: `/tasks/:id/reminder`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
    ```json
    {
      "reminderDate": "2023-12-30T10:00:00Z"
    }
    ```
- **Responses**:
    - `200 OK`: Reminder set successfully
    - `400 Bad Request`: Missing reminder date
    - `401 Unauthorized`: Unauthorized access
    - `404 Not Found`: Task not found
    - `500 Internal Server Error`: Server issues

### Users

#### Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Responses**:
    - `200 OK`: Returns list of users
    - `404 Not Found`: No users exist
    - `500 Internal Server Error`: Server issues
 
  
## Enhancements
- **Sorting** : Enhanced task retrieval with sorting (by due date).
- **Task reminders** :  Added an endpoint to set email reminders for tasks.


### Future Enhancements
  - **Pagination** : Pagination of the retrieved data
  - **Testing** : Run Automated Tests with Jest/Mocha
  - **RBAC** : Admin level accessfor admin and users
