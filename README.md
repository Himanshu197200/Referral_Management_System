# Candidate Referral Management System

A full-stack MERN application for managing candidate referrals. This system allows users to refer candidates, view them on a dashboard, update their status, and manage referrals end-to-end.

## 🚀 Live Demo

- **Frontend**: [Your Vercel Frontend URL]
- **Backend API**: [Your Vercel Backend URL]

## Tech Stack

- **Frontend**: React (Vite) with functional components and hooks
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (both frontend and backend)
- **File Upload**: Multer (PDF only)

## Features

### Dashboard
- View all referred candidates in a responsive grid
- Real-time statistics (Total, Pending, Reviewed, Hired)
- Search candidates by name, email, or job title
- Filter candidates by status
- Update candidate status directly from the UI
- Delete candidates

### Candidate Form
- Submit new candidate referrals
- Fields: Name, Email, Phone, Job Title, Resume (PDF)
- Client-side and server-side validation
- PDF file upload with size limit (5MB)

### REST API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and available endpoints |
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
│   ├── controllers/
│   │   └── candidateController.js
│   ├── models/
│   │   └── Candidate.js
│   ├── routes/
│   │   └── candidateRoutes.js
│   ├── middlewares/
│   │   └── upload.js
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── seed.js
│   └── vercel.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── CandidateForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── SearchFilter.jsx
│   │   ├── services/
│   │   │   └── api.js
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

Create `.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/referral_management
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Seed Database (Optional)
```bash
cd backend
npm run seed
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

---

## 🌐 Deployment to Vercel

### Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/cli) (optional)
- MongoDB Atlas account with cluster

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP address `0.0.0.0/0` (allow from anywhere)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/referral_management
   ```

### Step 2: Deploy Backend to Vercel

1. **Push backend to GitHub** (if not already)

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your repository
   - Set the **Root Directory** to `backend`

3. **Configure Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `CLIENT_URL` | Your frontend Vercel URL (add after frontend deploy) |

4. **Deploy** and note your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. **Import to Vercel**:
   - Click "Add New" → "Project"
   - Import the same repository
   - Set the **Root Directory** to `frontend`

2. **Configure Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://your-backend.vercel.app/api` |

3. **Deploy** and note your frontend URL

### Step 4: Update Backend CORS

Go back to your backend project on Vercel and update:
| Variable | Value |
|----------|-------|
| `CLIENT_URL` | `https://your-frontend.vercel.app` |

Redeploy the backend for changes to take effect.

---

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (local only) | `5001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `CLIENT_URL` | Frontend URL(s) for CORS | `https://your-app.vercel.app` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-api.vercel.app/api` |

---

## API Documentation

### Create Candidate
**POST** `/api/candidates`

Request (multipart/form-data):
```
name: "John Doe"
email: "john@example.com"
phone: "1234567890"
jobTitle: "Software Engineer"
resume: [PDF file] (optional)
```

Response:
```json
{
  "success": true,
  "message": "Candidate referred successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "jobTitle": "Software Engineer",
    "status": "Pending",
    "resumeUrl": "/uploads/filename.pdf",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get All Candidates
**GET** `/api/candidates`

Query Parameters:
- `status`: Filter by status (Pending, Reviewed, Hired)
- `search`: Search by name, email, or job title

### Update Status
**PUT** `/api/candidates/:id/status`

Request:
```json
{
  "status": "Reviewed"
}
```

### Delete Candidate
**DELETE** `/api/candidates/:id`

---

## Scripts

### Backend
```bash
npm start      # Start production server
npm run dev    # Start development server
npm run seed   # Seed database with sample data
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

---

## Troubleshooting

### CORS Issues
- Ensure `CLIENT_URL` in backend includes your frontend domain
- Multiple origins can be comma-separated: `https://app1.vercel.app,https://app2.vercel.app`
- Vercel preview deployments are automatically allowed

### Database Connection
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format is correct

### Build Failures
- Ensure all dependencies are in `dependencies` (not `devDependencies`) for production

---

## License

ISC