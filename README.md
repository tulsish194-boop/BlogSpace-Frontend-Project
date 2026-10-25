# BlogSpace — Full-Stack Blog Application

BlogSpace is a beginner-friendly blog application developed as part of my internship project at Codomax Digital Solutions. It combines a frontend built with HTML, CSS, and JavaScript with a backend powered by Node.js and Express.js.

## Features

- User registration
- User login
- Create and publish blog posts
- View blog posts on the dashboard
- Delete posts from the dashboard
- Responsive frontend design
- REST APIs for registration, login, and blog creation

## Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- CORS
- REST APIs

## Project Structure

```text
BlogSpace-Frontend-Project/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── style.css
├── app.js
├── README.md
└── backend/
    ├── server.js
    ├── package.json
    └── package-lock.json
```

## Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| GET | `/api/blogs` | Retrieve blog posts |
| POST | `/api/register` | Register a user |
| POST | `/api/login` | Log in a user |
| POST | `/api/blogs` | Create a blog post |

## How to Run the Project Locally

### Prerequisites

Install Node.js on your computer.

### 1. Start the backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The backend should run at:

`http://localhost:5000`

### 2. Start the frontend

Open a second terminal in the main project folder and run:

```bash
npx serve .
```

Open the local frontend address shown in the terminal. If it shows port 3000, visit:

`http://localhost:3000`

### 3. Test the APIs

You can test these endpoints using a REST API testing tool:

- `GET http://localhost:5000/`
- `GET http://localhost:5000/api/blogs`
- `POST http://localhost:5000/api/register`
- `POST http://localhost:5000/api/login`
- `POST http://localhost:5000/api/blogs`

For POST requests, send JSON data with the appropriate fields.

Example registration data:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "example-password"
}
```

Example login data:

```json
{
  "email": "test@example.com",
  "password": "example-password"
}
```

Example blog creation data:

```json
{
  "title": "My First Blog",
  "content": "This is my first blog post.",
  "author": "testuser"
}
```

## Current Limitations

- User and blog data are stored in server memory and are lost when the backend restarts.
- Passwords are not yet securely hashed.
- The backend is designed for local development and has not been deployed as a public API.
- GitHub Pages can host the static frontend but cannot run the Express backend.

## Future Improvements

- Integrate a database such as MongoDB.
- Hash passwords securely.
- Add authentication and authorization.
- Deploy the backend to a hosting service.
- Connect the frontend to a deployed backend API.

## Internship Project

Developed as part of my internship learning journey at Codomax Digital Solutions.

Thank you for visiting my project!
