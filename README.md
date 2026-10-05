# DevPrep AI

An AI-powered mock interview platform that generates personalized interview questions, evaluates candidate responses, and tracks improvement across multiple practice sessions.

> Built as a full-stack portfolio project using React, Node.js, Express, MongoDB, and the Google Gemini API.

## Live Demo

**Application:** https://ai-prep-platform-53jd.onrender.com

**Repository:** [github.com/deep-vish2005/AI-prep-platform](https://github.com/deep-vish2005/AI-prep-platform)

> The free Render service may take a short time to start after a period of inactivity.

---

## Overview

DevPrep AI helps students and developers prepare for technical and behavioral interviews through personalized AI-assisted practice.

Users can configure an interview based on their target role, experience level, interview format, focus topics, and preferred number of questions. Gemini generates relevant questions and evaluates each submitted answer with a score, identified strengths, missing concepts, and actionable recommendations.

Completed sessions are stored in MongoDB and used to generate reports, interview history, dashboard metrics, and performance analytics.

---

## Features

### Authentication and Account Security

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected frontend and backend routes
- Profile management
- Secure password changes
- User-specific data isolation
- Rate-limited authentication endpoints

### AI Mock Interviews

- AI-generated interview questions
- Role-specific question generation
- Beginner, intermediate, and advanced difficulty levels
- Technical, behavioral, and mixed interviews
- Multiple focus-topic selection
- Configurable interview length
- AI answer evaluation
- Question skipping
- Interview progress tracking
- Resume support for incomplete sessions

### AI Feedback

Each submitted answer receives:

- Score out of 10
- Identified strength
- Important missing concept
- Actionable improvement suggestion

### Reports and Analytics

- Persistent interview reports
- Overall score calculation
- Topic-level performance
- Strengths and improvement areas
- Question-by-question breakdown
- PDF report download
- Interview history
- Search and format filtering
- Performance-over-time charts
- CSV analytics export
- Recommended focus topics

### User Experience

- Responsive desktop, tablet, and mobile layouts
- Light and dark themes
- Persistent theme preference
- Mobile navigation drawer
- Loading, empty, and error states
- Accessible form labels and controls

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React
- jsPDF
- jsPDF AutoTable

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Gemini API
- JSON Web Tokens
- bcrypt
- Zod
- Helmet
- Express Rate Limit

### Testing

- Vitest
- Supertest
- MongoDB Memory Server

### Deployment

- Render Web Service
- MongoDB Atlas

---

## Architecture

```text
Browser
   │
   ▼
React + Tailwind CSS
   │
   │ Same-origin /api requests
   ▼
Node.js + Express
   ├── JWT authentication
   ├── Zod request validation
   ├── Rate limiting
   ├── Gemini integration
   └── Ownership authorization
         │
         ├──────────────► Google Gemini API
         │
         └──────────────► MongoDB Atlas
```

The production React build is served directly by Express. This allows the frontend and backend to use one public Render URL.

---

## Application Flow

1. A user creates an account or logs in.
2. The user configures a mock interview.
3. The backend validates the request using Zod.
4. Gemini generates questions based on the selected configuration.
5. The interview is stored in MongoDB.
6. The user answers or skips each question.
7. Gemini evaluates submitted answers.
8. Scores and feedback are saved to MongoDB.
9. The completed interview generates a persistent report.
10. Dashboard and Analytics pages summarize saved interview data.

---

## Project Structure

```text
AI-prep-platform/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   ├── common/
│   │   ├── dashboard/
│   │   └── interview/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validation/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## Local Development

### Prerequisites

Install:

- Node.js 20 or newer
- npm
- Git

You will also need:

- A MongoDB Atlas account
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/deep-vish2005/AI-prep-platform.git
cd AI-prep-platform
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure backend environment variables

Copy:

```text
server/.env.example
```

to:

```text
server/.env
```

Add your values:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/devprep_ai

JWT_SECRET=replace_with_a_long_random_secret

GEMINI_API_KEY=replace_with_your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Never commit `server/.env`.

### 5. Start the backend

```bash
cd server
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal from the project root:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## Available Scripts

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production React build.

```bash
npm run lint
```

Runs ESLint against the frontend source.

```bash
npm run preview
```

Previews the production frontend build locally.

### Backend

```bash
cd server
npm run dev
```

Starts Express using Nodemon.

```bash
cd server
npm start
```

Starts Express in production mode.

```bash
cd server
npm test
```

Runs the automated API security tests.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create an account | No |
| `POST` | `/api/auth/login` | Log in | No |
| `GET` | `/api/auth/me` | Get the current user | Yes |
| `PATCH` | `/api/auth/profile` | Update profile information | Yes |
| `PATCH` | `/api/auth/password` | Change password | Yes |

### Interviews

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/interviews` | Generate and create an interview | Yes |
| `GET` | `/api/interviews` | Get the current user's interviews | Yes |
| `GET` | `/api/interviews/:interviewId` | Get one owned interview | Yes |
| `POST` | `/api/interviews/:interviewId/questions/:questionId/answer` | Submit and evaluate an answer | Yes |
| `POST` | `/api/interviews/:interviewId/questions/:questionId/skip` | Skip a question | Yes |

### Analytics

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/analytics` | Get user-specific performance analytics | Yes |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API availability |

---

## Validation and Security

DevPrep AI uses multiple security layers:

- Passwords are hashed using bcrypt.
- Protected endpoints require signed JWTs.
- Zod validates incoming API requests.
- Mongoose validates stored database documents.
- Interview queries enforce authenticated ownership.
- Users cannot access another user's interview by changing a URL.
- Helmet applies HTTP security headers.
- Authentication and API endpoints are rate-limited.
- CORS permits only configured origins.
- Request bodies have size limits.
- Production errors hide internal stack traces.
- Gemini and MongoDB credentials remain server-side.
- Real environment files are excluded from Git.

### Security Note

The current résumé MVP stores the JWT in browser local storage. A production-critical version should consider secure HTTP-only cookies, refresh-token rotation, email verification, password recovery, and centralized logging.

---

## Automated Tests

The backend tests use an isolated in-memory MongoDB instance and do not modify the production database.

Run:

```bash
cd server
npm test
```

The test suite verifies that:

- Protected endpoints reject unauthenticated requests
- Invalid JWTs are rejected
- Invalid registration input is rejected
- Cross-user interview access is blocked
- Interview owners can access their own data

---

## Production Deployment

The complete application can be deployed as one Render Web Service.

### Render configuration

```text
Root Directory: leave empty
Build Command: npm ci && npm run build && npm --prefix server ci --omit=dev
Start Command: npm --prefix server start
Health Check Path: /api/health
```

### Production environment variables

```env
NODE_ENV=production
CLIENT_URL=https://YOUR-RENDER-URL.onrender.com
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
NODE_VERSION=22
```

The deployed Express service serves both the React application and the API.

---

## Future Improvements

- Voice-based mock interviews
- Resume-based question generation
- Coding editor with automated test cases
- Follow-up questions based on candidate responses
- Email verification
- Password recovery
- Secure HTTP-only cookie authentication
- Shareable interview reports
- More detailed communication scoring
- Logging and monitoring
- Independent frontend and backend scaling

---

## Resume Summary

**DevPrep AI — AI Mock Interview Platform**

- Developed a full-stack mock interview platform using React, Express, MongoDB, and the Google Gemini API.
- Implemented personalized question generation and structured answer evaluation with actionable feedback.
- Built secure JWT authentication, role-based data ownership, Zod validation, rate limiting, and automated authorization tests.
- Created persistent reports, topic analytics, interview history, PDF downloads, CSV exports, dark mode, and responsive layouts.
- Deployed the React frontend and Express API as a single production service.

---

## Author

**Deep**

GitHub: [deep-vish2005](https://github.com/deep-vish2005)

---

## License

This project is intended for educational and portfolio use.
