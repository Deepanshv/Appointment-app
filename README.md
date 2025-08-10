Appointment Booking App
A full-stack appointment booking application featuring a secure REST API and a React frontend. It allows patients to book appointments and administrators to manage them, with a focus on preventing double bookings and providing clear role-based access.

Submission Checklist
Frontend URL: https://appointment-app-deepanshv.vercel.app (Replace with your URL)

API URL: https://appointment-app-api-deepanshv.onrender.com (Replace with your URL)

Repo URL: https://github.com/Deepanshv/Appointment-app

Admin: admin@example.com / Passw0rd!

Patient: patient@example.com / Passw0rd! (Must be registered first)

Run locally: Steps are included below.

Postman/curl steps included: A cURL verification script is included below.

Notes on trade-offs & next steps: Included at the end.

Tech Stack
This project uses a React (Vite) frontend, a Node.js/Express backend, and a PostgreSQL database managed with the Prisma ORM. This stack was chosen for its rapid development capabilities, strong ecosystem, and excellent free tiers for deployment on Vercel and Render.

How to Run Locally
1. Clone Repository:

Bash

git clone https://github.com/Deepanshv/Appointment-app.git
cd Appointment-app
2. Setup Backend (/api):

Bash

cd api
npm install
# Add DATABASE_URL and JWT_SECRET to a new .env file
npx prisma migrate dev
npm run seed
npm run dev
(API runs on http://localhost:3001)

3. Setup Frontend (/client):

Bash

# In a new terminal
cd client
npm install
# Ensure .env.local has VITE_API_URL=http://localhost:3001/api
npm run dev
(Frontend runs on http://localhost:5173)

Architecture Notes
Authentication: Handled via stateless JWTs containing the user's role, stored in localStorage. Middleware on the backend protects routes and verifies roles.

Booking Concurrency: Double-booking is prevented atomically at the database level using a @unique constraint on the slotId. The API catches the specific database error and returns a 409 Conflict status.

Time Zones: All dates are handled in UTC on the backend to ensure consistency. The frontend is responsible for formatting times to the user's local timezone.

Quick Verification Script (cURL)
Bash

# Set your live API URL after deployment
API_URL="https://appointment-app-api-deepanshv.onrender.com/api"

echo "### 1. Registering a new patient..."
curl -s -X POST "$API_URL/register" -H "Content-Type: application/json" -d '{"name":"Test Patient","email":"testcurl@example.com","password":"Password123"}' | jq

echo "\n### 2. Logging in and capturing token..."
TOKEN=$(curl -s -X POST "$API_URL/login" -H "Content-Type: application/json" -d '{"email":"testcurl@example.com","password":"Password123"}' | jq -r '.token')
echo "Token captured."

echo "\n### 3. Getting and booking the first available slot..."
SLOT_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/slots" | jq -r '.[0].id')
curl -s -X POST "$API_URL/book" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"slotId\":\"$SLOT_ID\"}" | jq

echo "\n### 4. Verifying 'My Bookings'..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/my-bookings" | jq
Notes on Trade-offs & Next Steps
Due to the time constraint, automated tests were omitted in favor of delivering core functionality. The UI is minimal but functional. With two more hours, I would prioritize adding integration tests for the API, implementing a patient-facing cancellation feature, and refining the UI with a calendar view.
