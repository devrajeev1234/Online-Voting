# Quick Setup Guide

Follow these steps to get the demo voting system running:

## Step 1: Database Setup (5 minutes)

1. **Start MySQL** (if not running):
   ```bash
   # Windows (if installed as service, it should auto-start)
   # Linux/Mac
   sudo systemctl start mysql
   # or
   brew services start mysql
   ```

2. **Create Database and Tables**:
   ```bash
   cd database
   mysql -u root -p < schema.sql
   ```

3. **Seed Demo Data**:
   ```bash
   mysql -u root -p < seed.sql
   ```

4. **Verify** (optional):
   ```bash
   mysql -u root -p vote_system_demo -e "SELECT COUNT(*) FROM voters; SELECT COUNT(*) FROM parties;"
   ```
   Should show 10 voters and 5 parties.

## Step 2: Backend Setup (2 minutes)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file**:
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your MySQL credentials:
   # DB_PASSWORD=your_mysql_password
   # (Leave other defaults if they match your setup)
   ```

4. **Start backend server**:
   ```bash
   npm start
   ```
   
   You should see:
   ```
   === DEMO VOTING SYSTEM BACKEND ===
   Server running on http://localhost:3001
   ⚠️  DEMO PROTOTYPE ONLY - DO NOT USE IN PRODUCTION
   ```

## Step 3: Frontend Setup (2 minutes)

1. **Open a new terminal** and navigate to frontend:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

## Step 4: Access the Application

1. **Open browser**: Navigate to `http://localhost:3000`

2. **Test Voter Login**:
   - Click "Voter Login"
   - Use demo credentials:
     - Mock 12-Digit ID: `111122223333`
     - Voter ID: `VOTER001`
     - Phone: `9000000001`
   - Check "Terms & Conditions"
   - Submit and vote!

3. **Test Admin Login**:
   - Click "Admin Login"
   - Username: `nihal`
   - Password: `1234567`
   - (Optional) Check "Require OTP" - then check backend console for OTP code
   - View statistics and manage parties

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running: `mysql --version`
- Check credentials in `backend/.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- If database doesn't exist, re-run `schema.sql`

### Port Already in Use
- Backend (3001): Change `PORT` in `backend/.env` or kill process using port
- Frontend (3000): Change port in `frontend/vite.config.js`

### Dependencies Won't Install
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then `npm install` again

### Session Not Working
- Ensure cookies enabled in browser
- Check CORS settings in `backend/server.js` match frontend URL
- Try clearing browser cookies and retry

## Running Tests

```bash
cd backend
npm test
```

Tests verify:
- Voter authentication
- Vote submission
- Single-vote enforcement
- Admin authentication
- Party management

## Production Warnings

⚠️ **DO NOT use this system in production!**

This is a demo prototype with numerous security vulnerabilities. See `README.md` for detailed security warnings.

## Next Steps

- Explore the codebase
- Modify parties and voters
- Test different voting scenarios
- Review security warnings before any real use

Happy testing! 🗳️



