# Online Voting System - DEMO PROTOTYPE

<div align="center">

# ⚠️ **CRITICAL WARNING** ⚠️

## **THIS IS A DEMO PROTOTYPE FOR DEVELOPMENT/TESTING ONLY**

**DO NOT USE IN PRODUCTION**  
**DO NOT STORE REAL PERSONAL DATA**  
**DO NOT USE FOR REAL ELECTIONS**

This system is intended **ONLY** for:
- UX/UI testing and demonstration
- Development and learning purposes
- Prototype evaluation

For production voting systems, consult certified election-security professionals.

---

</div>

## Overview

This is a **demo prototype** of an Online Voting System built with React (Vite) + Tailwind CSS frontend, Node.js + Express backend, and MySQL database. All authentication and identification systems use **mock/fake identifiers only** - no real Aadhaar IDs or phone numbers are accepted or stored.

## Features (Demo Only)

- **Voter Interface**: Mock authentication with fake IDs, voting page with parties + NOTA option
- **Admin Interface**: Demo credentials login, party management, voting statistics
- **Single-Vote Enforcement**: Transaction-based prevention of double voting
- **Simulated OTP**: OTP codes printed to server console (no SMS sending)
- **Government-Style UI**: Formal, clean design with blue/cream palette

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MySQL2
- **Database**: MySQL
- **Authentication**: Session-based (demo only - DEPRECATED for production)
- **Testing**: Jest + Supertest

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher, or MariaDB)
- npm or yarn

## Setup Instructions

### 1. Database Setup

```bash
# Navigate to database directory
cd database

# Create database and tables
mysql -u root -p < schema.sql

# Seed with demo data
mysql -u root -p < seed.sql
```

The seed data includes:
- 10 demo voters (with fake IDs)
- 5 demo political parties
- 1 admin account (username: `nihal`, password: `1234567`)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example if needed)
# Edit .env with your MySQL credentials:
# PORT=3001
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=vote_system_demo
# SESSION_SECRET=demo-secret-key

# Start backend server
npm start
# Or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Demo Credentials

### Admin Login
- **Username**: `nihal`
- **Password**: `1234567`
- **OTP**: If enabled, check server console for the 6-digit code

### Demo Voters
Use any of these mock credentials (all fake IDs):

| Mock 12-Digit ID | Voter ID | Mock Phone |
|-----------------|----------|------------|
| 111122223333    | VOTER001 | 9000000001 |
| 111122223334    | VOTER002 | 9000000002 |
| 111122223335    | VOTER003 | 9000000003 |
| ... (see `database/seed.sql` for all) |

**Note**: Voter with ID `111122223337` (VOTER007) is pre-marked as already voted for testing.

## API Endpoints

### Voter Routes
- `POST /api/voter/login` - Authenticate voter with mock credentials
- `GET /api/parties` - List all parties
- `POST /api/voter/vote` - Submit vote (requires authentication)

### Admin Routes
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/verify-otp` - Verify OTP code (if enabled)
- `GET /api/admin/stats` - Get voting statistics
- `POST /api/admin/parties` - Add new party
- `DELETE /api/admin/parties/:id` - Delete party

### Health Check
- `GET /api/health` - Server status

## Running Tests

```bash
cd backend
npm test
```

Tests include:
- Voter login validation
- Vote submission and single-vote enforcement
- Admin authentication
- Party management

## Project Structure

```
VoteSystem/
├── frontend/          # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/# Reusable components
│   │   └── App.jsx    # Main app component
│   └── package.json
├── backend/           # Express backend
│   ├── server.js      # Main server file
│   ├── tests/         # Integration tests
│   └── package.json
├── database/          # SQL scripts
│   ├── schema.sql     # Database schema
│   └── seed.sql       # Demo seed data
└── README.md          # This file
```

## Security Warnings

### ⚠️ **DO NOT USE IN PRODUCTION**

This prototype contains **numerous security vulnerabilities** that are acceptable for demo purposes but **MUST be fixed** for any real use:

1. **Plain Text Passwords**: Admin passwords stored/compared in plain text
   - **Production Fix**: Use bcrypt with salt

2. **Session-Based Auth**: Basic session management
   - **Production Fix**: Use JWT with refresh tokens or OAuth

3. **Mock Identifiers**: No real ID verification
   - **Production Fix**: Integrate with certified ID verification services

4. **No Audit Logging**: No comprehensive audit trail
   - **Production Fix**: Add detailed logging and audit tables

5. **OTP in Console**: OTP printed to console only
   - **Production Fix**: Use secure SMS/Email providers

6. **SQL Injection Protection**: Uses parameterized queries, but needs additional validation
   - **Production Fix**: Add input validation middleware

7. **No Rate Limiting**: No protection against brute force
   - **Production Fix**: Add rate limiting middleware

8. **HTTP Only**: No HTTPS enforcement in demo
   - **Production Fix**: Enforce HTTPS with proper SSL certificates

## Single-Vote Enforcement

The system uses **database transactions** with `FOR UPDATE` locks to prevent race conditions and ensure each voter can only vote once. When a vote is submitted:

1. Transaction begins
2. Voter record is locked (`SELECT ... FOR UPDATE`)
3. Check `has_voted` flag
4. Insert vote record
5. Update `has_voted = TRUE`
6. Commit transaction

This ensures atomicity even under concurrent requests.

## Development Notes

- All mock identifiers are clearly marked with "DEMO" or "MOCK" in comments
- Security-sensitive code sections have warnings about production replacements
- Session cookies are HTTP-only in production-ready configuration
- CORS is configured for local development

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql --version`
- Check credentials in `.env` file
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
- Change ports in `frontend/vite.config.js` (frontend) or `backend/server.js` (backend)
- Update CORS settings if needed

### Session Not Working
- Ensure cookies are enabled in browser
- Check CORS configuration matches frontend URL
- Verify `SESSION_SECRET` is set in `.env`

## Contributing

This is a demo prototype. For improvements:
1. Ensure all security warnings are maintained
2. Keep mock identifiers clearly marked
3. Add tests for new features
4. Update README with changes

## GitHub Pages Deployment

The frontend can be deployed to GitHub Pages for public access.

**Quick Deploy:**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository Settings → Pages → Source: GitHub Actions
3. The workflow will automatically deploy on push to `main` branch

**Access:** `https://YOUR_USERNAME.github.io/VoteSystem/`

**Note:** The backend API must be deployed separately (Heroku, Railway, Render, etc.) and the frontend API URL updated for production.

See `DEPLOYMENT.md` for detailed deployment instructions.

## License

MIT License - See LICENSE file for details

## Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS" FOR DEMONSTRATION PURPOSES ONLY.**

The authors and contributors:
- Make no warranties regarding security, accuracy, or suitability for any purpose
- Are not responsible for any misuse of this software
- Strongly advise against using this system for real elections or storing real personal data
- Recommend consulting certified election-security professionals for production voting systems

**By using this software, you acknowledge that it is a prototype and agree not to use it in production or with real personal data.**

---

**Last Updated**: 2024  
**Version**: 1.0.0 (Demo Prototype)



