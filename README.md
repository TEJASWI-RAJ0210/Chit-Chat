# 💬 ChitChat

<p align="center">
  <img src="./assets/logo.png" alt="ChitChat Logo" width="150"/>

**A modern real-time chat application powered by the MERN stack, Socket.IO, and Groq AI.**

</p>

<p align="center">
  <a href="YOUR_LIVE_DEMO_LINK">🌐 Live Demo</a> 
</p>

---

## 📖 Overview

ChitChat is a full-stack real-time messaging platform built using the **MERN stack**. It enables users to communicate instantly through a clean and responsive interface while leveraging **Socket.IO** for low-latency messaging.

The application also integrates the **Groq API**, allowing users to interact with an AI chatbot directly within the platform for quick assistance and intelligent conversations.

---

## ✨ Features

* ⚡ Real-time messaging using Socket.IO
* 🤖 AI chatbot powered by Groq API
* 🔐 Secure authentication with JWT
* 🔑 Google OAuth login support
* 💾 Persistent chat history stored in MongoDB Atlas
* 👤 User profile management
* 🖼️ Media upload support via Cloudinary
* 🟢 Online user presence
* 📱 Responsive UI for desktop and mobile devices
* 🎨 Clean and modern interface built with Tailwind CSS
* 🚀 Scalable backend architecture using Express.js

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* Mongoose

### Database

* MongoDB Atlas

### Authentication

* JWT Authentication
* Google OAuth

### AI Integration

* Groq API

### Media Storage

* Cloudinary

---

## 📂 Project Structure

```text
ChitChat/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
cd ChitChat
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory and configure the following variables:

```env
MONGODB_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

JWT_SECRET=

BACKFILL_SECRET=

GROQ_API_KEY=
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will typically be available at:

```text
http://localhost:5173
```

and the backend at:

```text
http://localhost:5000
```

---

## 📸 Screenshots

### 🏠 Home Page

> *Screenshot Placeholder*

![Home](./assets/screenshots/home-placeholder.png)

---

### 💬 Chat Interface

> *Screenshot Placeholder*

![Chat](./assets/screenshots/chat-placeholder.png)

---

### 🤖 AI Chatbot

> *Screenshot Placeholder*

![AI](./assets/screenshots/ai-placeholder.png)

---

### 🔐 Authentication

> *Screenshot Placeholder*

![Auth](./assets/screenshots/auth-placeholder.png)

---

## 🤖 Groq AI Integration

ChitChat integrates the **Groq API** to provide an intelligent AI chatbot experience.

Capabilities include:

* Answering user queries
* Engaging in conversational interactions
* Providing coding and general assistance
* Delivering responses within the chat interface

---

## 📡 Real-Time Communication

The application uses **Socket.IO** to enable bidirectional communication between the client and server.

Key benefits include:

* Instant message delivery
* Live synchronization between connected users
* Efficient event-driven architecture
* Reduced latency for an enhanced chatting experience

---

## 🚀 Future Improvements

* Message reactions
* End-to-end encryption
* Voice messaging
* Video calling
* Message editing and deletion
* Chat backups
* AI-powered smart reply suggestions

---

## 👥 Contributors

* **Contributor 1** – *Soumya Sinha*
* **Contributor 2** – *Swoasti Bhattacharjee*
* **Contributor 3** – *Anmol Pandey*
* **Contributor 4** – *Swayam Mohapatra*
* **Contributor 5** – *Tejaswi Raj*

---

## 📄 License

This project is developed as a **personal project** for learning, experimentation, and portfolio purposes.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub and sharing your feedback or suggestions.

Happy Coding! 🚀
