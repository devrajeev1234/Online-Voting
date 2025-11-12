# Database Setup Commands (CMD)

## Quick Setup (Automated)

Run the batch file:
```cmd
cd database
setup_database.cmd
```

## Manual Setup (Step by Step)

### Step 1: Create Database and Tables
```cmd
cd database
mysql -u root -p < schema.sql
```

You will be prompted for your MySQL root password.

### Step 2: Seed Demo Data
```cmd
mysql -u root -p < seed.sql
```

Enter your MySQL root password again.

### Step 3: Verify Setup (Optional)
```cmd
mysql -u root -p -e "USE vote_system_demo; SELECT COUNT(*) as 'Total Voters' FROM voters; SELECT COUNT(*) as 'Total Parties' FROM parties;"
```

## Individual Commands

### Connect to MySQL
```cmd
mysql -u root -p
```

### Create Database Only
```cmd
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vote_system_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Run Schema Only
```cmd
mysql -u root -p vote_system_demo < schema.sql
```

### Run Seed Only
```cmd
mysql -u root -p vote_system_demo < seed.sql
```

### Check Tables
```cmd
mysql -u root -p -e "USE vote_system_demo; SHOW TABLES;"
```

### View Voters
```cmd
mysql -u root -p -e "USE vote_system_demo; SELECT * FROM voters LIMIT 5;"
```

### View Parties
```cmd
mysql -u root -p -e "USE vote_system_demo; SELECT * FROM parties;"
```

## Troubleshooting

### If MySQL is not in PATH
Use full path:
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < schema.sql
```

### If you get "Access Denied"
1. Make sure MySQL is running
2. Check username/password
3. Try with different user if you have one configured

### If database already exists
```cmd
mysql -u root -p -e "DROP DATABASE IF EXISTS vote_system_demo;"
```
Then run setup again.

## Configuration for Backend

After database setup, configure `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vote_system_demo
```



