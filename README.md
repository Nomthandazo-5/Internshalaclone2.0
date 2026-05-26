Internshalaclone2.0

InternClone is a full-stack web application built to mimick the real internshala website but from a refined perspective to simulate its internship discovery and management platform. The goal of this project was to understand how real-world platforms handle authentication, data flow between frontend and backend, and deployment across different environments.
This project is not just about listing internships, it’s about creating a smooth experience where users can log in, explore opportunities, and interact with the platform in a meaningful way.

While learning full-stack development, I wanted to work on something that goes beyond tutorials. Internship platforms are a great example of real-world systems that involve:
User authentication
API integration
Database management
Deployment handling
Cross-origin communication issues (CORS)
Secure environment variable handling

This project helped me understand how all these pieces come together in a production-like setup.
Tech Stack
Frontend
Next.js (React-based framework)
TypeScript
Firebase Authentication (Google Login)
Fetch/Axios for API calls
CSS / Tailwind (based on UI design)
Backend
Node.js
Express.js
MongoDB (Atlas cloud database)
JWT Authentication
CORS configuration
Deployment
Frontend hosted on Vercel
Backend hosted on Render
Database on MongoDB Atlas
Authentication Flow

Authentication is handled in two layers:
Firebase Authentication
Used for Google Sign-In
Handles identity verification
JWT (Backend Security Layer)
Once user logs in, backend generates a JWT token
This token is used to protect API routes and verify requests

This combination ensures both secure login and protected backend access.
Key Features
User Features
Sign up / Login using Google
Secure authentication session handling
Persistent login state

Internship Features
Browse available internships
View internship details
Fetch data dynamically from backend API

API Integration
Frontend communicates with backend via REST APIs
Proper handling of async data fetching
Error handling for failed requests

Deployment Setup
This project is deployed in a full production-like environment:
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

One of the challenges I faced here was handling CORS errors when connecting frontend and backend after deployment. This helped me understand how important origin configuration is in real-world applications.
Environment Variables
To run this project properly, the following environment variables are required:
Backend (.env)
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
RAZORPAY_KEY=your_key (if used)
RAZORPAY_SECRET=your_secret (if used)

Frontend (.env)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key

Project Structure
InternClone/
│
├── backend/
│   ├── models/        # Database schemas
│   ├── routes/        # API routes
│   ├── controllers/   # Logic handling
│   ├── middleware/    # Auth verification
│   └── server.js
│
├── frontend/
│   ├── pages/         # App pages
│   ├── components/    # Reusable UI components
│   ├── firebase.ts    # Firebase config
│   └── styles/
│
└── README.md

How to Run This Project Locally
Step 1: Clone the repository
git clone https://github.com/your-username/internclone.git
Step 2: Backend setup
cd backend
npm install
npm run dev
Step 3: Frontend setup
cd frontend
npm install
npm run dev

Then open:
http://localhost:3000

Challenges I Faced
A few real-world issues came up while building this:

CORS errors after deployment
Handling environment variables across Vercel and Render
API connection issues when switching from localhost to production URLs
Debugging authentication flow between Firebase and JWT
Render cold start delays on backend requests
These helped me understand production-level debugging much better.

Developer
Built by: Nomthandazo.
This project was created as part of my learning journey in full-stack development and deployment workflows.

Final Note
This project was an Internship from Elevance Skills and through this internship, l learnt to connect frontend, backend, database, and deployment into one working system. 
It also gave me real experience dealing with production issues like CORS, authentication flow, and environment configuration.
