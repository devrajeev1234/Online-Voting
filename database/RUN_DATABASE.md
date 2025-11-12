# How to Run Database Setup

## Quick Steps

### Step 1: Find MySQL Installation

If MySQL is installed, find where it's located:

**Common MySQL locations:**
- `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`
- `C:\xampp\mysql\bin\mysql.exe` (if using XAMPP)
- `C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe` (if using WAMP)
- `C:\Program Files\MariaDB\bin\mysql.exe` (if using MariaDB)

### Step 2: Run Setup

**Option A: If MySQL is in your PATH**
```cmd
cd database
setup_database.cmd
```

**Option B: If MySQL is NOT in PATH (most common)**

1. **Edit `run_setup.bat`** and update the `MYSQL_PATH` variable to your MySQL location
2. **Run the batch file:**
   ```cmd
   cd database
   run_setup.bat
   ```

**Option C: Manual commands (recommended)**

Replace `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe` with your actual MySQL path:

```cmd
cd database

REM Create database and tables
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < schema.sql

REM Seed demo data
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < seed.sql

REM Verify (with password)
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pDevrajeev1234 -e "USE vote_system_demo; SELECT COUNT(*) FROM voters; SELECT COUNT(*) FROM parties;"
```

## Step 3: Start MySQL Service (if not running)

**Using Services:**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MySQL80" or "MySQL"
4. Right-click → Start (if stopped)

**Using Command Prompt (as Administrator):**
```cmd
net start MySQL80
```

## Step 4: Verify MySQL is Running

```cmd
mysql -u root -p -e "SELECT VERSION();"
```

Or check if MySQL service is running:
```cmd
sc query MySQL80
```

## Troubleshooting

### "mysql is not recognized"
- MySQL is not in your PATH
- Use full path to mysql.exe (see Option C above)
- Or add MySQL to PATH (see below)

### "Access Denied"
- Wrong password
- MySQL service not running
- User doesn't have permissions

### "Can't connect to MySQL server"
- MySQL service not started
- Wrong host/port
- Firewall blocking connection

### Adding MySQL to PATH (Optional)

1. Find your MySQL installation folder (usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
2. Right-click "This PC" → Properties
3. Advanced System Settings → Environment Variables
4. Under "System Variables", find "Path" → Edit
5. Click "New" → Add MySQL bin path
6. Click OK on all dialogs
7. Restart Command Prompt

## After Database Setup

1. Update `backend/.env` with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=Devrajeev1234
   DB_NAME=vote_system_demo
   ```

2. Start the backend server:
   ```cmd
   cd backend
   npm install
   npm start
   ```

3. Start the frontend:
   ```cmd
   cd frontend
   npm install
   npm run dev
   ```

## Quick Test Connection

Test if you can connect:
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pDevrajeev1234 -e "SHOW DATABASES;"
```

This should list all databases, including `vote_system_demo` after setup.



