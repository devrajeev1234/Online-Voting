# Troubleshooting "Internal Server Error"

## Quick Checklist

1. ✅ **Backend server is running** on port 3001
2. ✅ **MySQL service is running**
3. ✅ **Database is created and seeded**
4. ✅ **Backend .env file is configured correctly**

## Step-by-Step Fix

### Step 1: Check Backend Server

Make sure the backend is running:

```cmd
cd backend
npm start
```

You should see:
```
=== DEMO VOTING SYSTEM BACKEND ===
Server running on http://localhost:3001
⚠️  DEMO PROTOTYPE ONLY - DO NOT USE IN PRODUCTION
```

**If backend is not running:**
- The frontend can't connect to the API
- You'll get "Internal server error" or network errors

### Step 2: Check Database Connection

**Test database connection manually:**

```cmd
mysql -u root -p -e "USE vote_system_demo; SELECT COUNT(*) FROM voters;"
```

**If this fails:**
- Database doesn't exist → Run `database/schema.sql`
- Wrong credentials → Check your password
- MySQL not running → Start MySQL service

### Step 3: Verify Backend .env Configuration

Make sure `backend/.env` exists and has correct values:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Devrajeev1234
DB_NAME=vote_system_demo
SESSION_SECRET=demo-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**Create .env if it doesn't exist:**
```cmd
cd backend
copy env.example .env
# Then edit .env with your MySQL password
```

### Step 4: Check Backend Console for Errors

When you try to login, check the **backend terminal/console**. The error details will be printed there:

```
Voter login error: Error: ...
```

Common errors you might see:
- `ER_BAD_DB_ERROR: Unknown database 'vote_system_demo'` → Database not created
- `ER_ACCESS_DENIED_ERROR` → Wrong username/password
- `ECONNREFUSED` → MySQL service not running
- `ETIMEDOUT` → Can't connect to MySQL

### Step 5: Verify Database Setup

Make sure database is set up correctly:

```cmd
cd database
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

Then verify:
```cmd
mysql -u root -p -e "USE vote_system_demo; SELECT * FROM voters LIMIT 1;"
```

## Common Issues & Solutions

### Issue: "ER_BAD_DB_ERROR: Unknown database"
**Solution:** Database not created. Run:
```cmd
cd database
mysql -u root -p < schema.sql
```

### Issue: "ER_ACCESS_DENIED_ERROR"
**Solution:** Wrong password in `backend/.env`. Update `DB_PASSWORD`.

### Issue: "ECONNREFUSED" or "ETIMEDOUT"
**Solution:** MySQL service not running:
```cmd
net start MySQL80
```

### Issue: Backend won't start
**Solution:** 
1. Check if port 3001 is already in use
2. Make sure all dependencies are installed: `npm install`
3. Check for syntax errors in server.js

### Issue: Frontend can't reach backend
**Solution:**
1. Make sure backend is running on port 3001
2. Check CORS settings in `backend/server.js`
3. Try accessing `http://localhost:3001/api/health` in browser

## Testing the Connection

### Test 1: Health Check
Open browser: `http://localhost:3001/api/health`
Should return: `{"status":"ok","message":"DEMO PROTOTYPE - Development only"}`

### Test 2: Database Query from Backend
Add this temporary route to `backend/server.js`:
```javascript
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await dbPool.execute('SELECT COUNT(*) as count FROM voters');
    res.json({ success: true, voterCount: rows[0].count });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
```
Then visit: `http://localhost:3001/api/test-db`

### Test 3: Use Demo Credentials
Make sure you're using **valid demo credentials** from seed data:
- Mock 12-Digit ID: `111122223333`
- Mock Voter ID: `VOTER001`
- Mock Phone: `9000000001`

## Still Not Working?

1. **Check backend console** - Error details are logged there
2. **Check MySQL logs** - Look for connection attempts
3. **Restart both services:**
   ```cmd
   # Restart MySQL
   net stop MySQL80
   net start MySQL80
   
   # Restart backend
   # Stop backend (Ctrl+C)
   # Start again: cd backend && npm start
   ```

4. **Verify credentials match:**
   - MySQL root password = `backend/.env` DB_PASSWORD
   - Database name = `backend/.env` DB_NAME



