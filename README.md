# Candidate Referral Management System

A full-stack MERN application for managing candidate referrals. This system allows users to refer candidates, view them on a dashboard, update their status, and manage referrals end-to-end.

## Live Demo

- **Frontend**: https://referral-management-system-three.vercel.app/
- **Backend API**: https://referral-management-system-backend.vercel.app/

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (for PDF Resumes)
- **Deployment**: Vercel (both frontend and backend)
- **Authentication**: JWT (JSON Web Tokens)

## Features

### Dashboard
- View all referred candidates in a responsive grid
- Real-time statistics (Total, Pending, Reviewed, Hired)
- Search candidates by name, email, or job title
- Filter candidates by status
- Update candidate status directly from the UI
- Delete candidates
- View uploaded resume PDFs directly in browser

### Candidate Form
- Submit new candidate referrals
- Fields: Name, Email, Phone, Job Title, Resume (PDF)
- Client-side and server-side validation
- PDF file upload with size limit (5MB) powered by Cloudinary

### Security
- User Authentication with JWT
- Protected routes for sensitive operations
- Secure password hashing with bcrypt

### REST API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates` | Create a new candidate |
| GET | `/api/candidates` | Fetch all candidates (with optional filters) |
| GET | `/api/candidates/:id` | Get a single candidate |
| PUT | `/api/candidates/:id/status` | Update candidate status |
| DELETE | `/api/candidates/:id` | Delete a candidate |
| GET | `/api/health` | Health check endpoint |

## Project Structure

```
Referral_Management_System/
├── backend/
│   ├── config/
│   │   └── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   └── candidateController.js
│   │   └── authController.js
│   ├── models/
│   │   └── Candidate.js
│   │   └── User.js
│   ├── routes/
│   │   └── candidateRoutes.js
│   │   └── authRoutes.js
│   ├── middlewares/
│   │   └── upload.js
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── vercel.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── CandidateForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SearchFilter.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Referral_Management_System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file based on `.env.example`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/referral_management
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

---

## Deployment to Vercel

### Prerequisites
- Vercel Account
- MongoDB Atlas account with cluster
- Cloudinary Account (for resume uploads)

### Step 1: Set Up MongoDB Atlas & Cloudinary
1. Create a MongoDB Atlas cluster and get the connection string
2. Create a Cloudinary account and get API credentials

### Step 2: Deploy Backend to Vercel
1. Import `backend` directory to Vercel
2. Configure Environment Variables:
   - `MONGODB_URI`
   - `CLIENT_URL` (Your frontend URL)
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Deploy

### Step 3: Deploy Frontend to Vercel
1. Import `frontend` directory to Vercel
2. Configure Environment Variables:
   - `VITE_API_URL` (Your backend URL + `/api`)
3. Deploy

### Step 4: Update Backend CORS
Update `CLIENT_URL` in backend environment variables to match your deployed frontend URL.

---

## Environment Variables Reference

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (local only) |
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL(s) for CORS |
| `JWT_SECRET` | Secret key for signing tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g., `https://your-api.vercel.app/api`) |

---

## License

ISC