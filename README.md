# 🏨 Hotel Booking Web Application

A full-stack hotel booking web application that allows users to search hotels, view room details, make reservations, and manage bookings. The project is built with ReactJS, Node.js, Express, MySQL, and Docker.

---

## ✨ Features

- User Authentication (Login / Register)
- Browse Hotels & Rooms
- Search and Filter Hotels
- Booking Management
- Responsive User Interface
- RESTful API Integration
- Dockerized Development Environment

---

## 🛠 Tech Stack

### Frontend

- ReactJS
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication

### DevOps

- Docker
- Docker Compose
- Git

---

## 📂 Project Structure

booking/

├── frontend/ # ReactJS application

├── backend/ # Express API

├── docker-compose.yml

└── README.md

---

## 🚀 Getting Started

### Clone repository

```bash
git clone https://github.com/Nhande9v/booking.git
cd booking
```

### Run with Docker

```bash
docker compose up --build
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### Run Backend

```bash
cd backend
npm install
npm run dev
```

---

## 📌 API

| Method | Endpoint | Description |
|----------|-----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/hotels | Get hotel list |
| GET | /api/hotels/:id | Hotel detail |
| POST | /api/bookings | Create booking |

---

## 👤 Author

Nguyen Hoang Nhan

GitHub:
https://github.com/Nhande9v
