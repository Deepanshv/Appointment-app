# Appointment App

A full-stack appointment booking application with a **Node.js/Express backend** (hosted on Render) and a **React frontend** (hosted on Vercel).
The app allows users to create accounts, log in, and manage appointments.

## 🚀 Live Demo

* **Frontend (Vercel)**: [Visit App](https://appointment-ce6en21mi-deepanshvs-projects.vercel.app)
* **Backend/API (Render)**: [API Base URL](https://appointment-app-9hg0.onrender.com)

---

## 📂 Project Structure

```
appointment-app/
│
├── backend/          # Express.js server, routes, controllers
├── frontend/         # React app (Vite/CRA/Next.js)
└── README.md
```

---

## ⚙️ Tech Stack

* **Frontend**: React, React Router, Axios
* **Backend**: Node.js, Express
* **Database**: (Add your DB here, e.g., MongoDB / PostgreSQL)
* **Hosting**: Vercel (frontend), Render (backend)

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Deepanshv/Appointment-app.git
cd Appointment-app
```

---

### 2️⃣ Backend Setup (Render)

```bash
cd backend
npm install
npm run dev
```

* Runs on `http://localhost:5000` by default.
* Configure your `.env` file:

```env
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret
```

---

### 3️⃣ Frontend Setup (Vercel)

```bash
cd frontend
npm install
npm run dev
```

* Runs on `http://localhost:3000` by default.
* Create a `.env` file:

```env
VITE_API_URL=https://appointment-app-9hg0.onrender.com
```

---

## 🌐 Deployment

### **Backend on Render**

1. Push the backend folder to a separate branch/repo if needed.
2. Create a new **Web Service** on Render.
3. Set **Start Command**:

   ```bash
   npm start
   ```
4. Add environment variables in Render dashboard.

### **Frontend on Vercel**

1. Import the frontend project into Vercel.
2. Add the `VITE_API_URL` in Vercel Environment Variables.
3. If using React Router (SPA), create a `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📌 API Endpoints

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register user        |
| POST   | `/api/auth/login`    | User login           |
| GET    | `/api/appointments`  | Get all appointments |
| POST   | `/api/appointments`  | Create appointment   |

---

## 🛠️ Development Notes

* Use **CORS** in backend to allow frontend API requests.
* Always test locally before deploying.
* Backend and frontend can be developed separately using different ports.

---
