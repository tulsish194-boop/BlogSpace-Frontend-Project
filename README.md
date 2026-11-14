# BlogSpace — Full-Stack Blog Application

BlogSpace is a beginner-friendly full-stack blog application developed as part of my internship project at Codomax Digital Solutions.

The project combines a frontend built with HTML, CSS, and JavaScript with a backend powered by Node.js, Express.js, and MongoDB.

## Features

- User registration and login interface
- Create and publish blog posts
- View blog posts
- Read individual blog posts
- Update existing blog posts
- Delete blog posts
- REST API integration
- MongoDB database integration
- Responsive frontend design

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

## Project Structure

```text
BlogSpace-Frontend-Project/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── style.css
├── app.js
├── README.md
└── backend/
    ├── server.js
    ├── db.js
    ├── models/
    ├── routes/
    ├── package.json
    └── .gitignore
```

## Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blogs` | Retrieve all blogs |
| GET | `/api/blogs/:id` | Retrieve a blog by ID |
| POST | `/api/blogs` | Create a blog |
| PUT | `/api/blogs/:id` | Update a blog |
| DELETE | `/api/blogs/:id` | Delete a blog |

## How to Run Locally

### 1. Start the backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure your MongoDB connection using the `MONGODB_URI` environment variable.

Start the backend:

```bash
npm.cmd start
```

The backend runs at:

`http://localhost:5000`

### 2. Start the frontend

Open the project folder in Visual Studio Code.

Use the Live Server extension to launch `index.html`.

## Internship Project

Developed as part of my internship learning journey at Codomax Digital Solutions.

Thank you for visiting my project!