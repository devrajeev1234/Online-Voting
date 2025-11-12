@echo off
echo ====================================
echo Database Setup for Vote System Demo
echo ====================================
echo.

echo Step 1: Creating database and tables...
mysql -u root -p < schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database. Please check your MySQL credentials.
    pause
    exit /b 1
)

echo.
echo Step 2: Seeding database with demo data...
mysql -u root -p < seed.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database.
    pause
    exit /b 1
)

echo.
echo ====================================
echo Database setup completed successfully!
echo ====================================
echo.
echo Verifying data...
mysql -u root -p -e "USE vote_system_demo; SELECT COUNT(*) as 'Voters' FROM voters; SELECT COUNT(*) as 'Parties' FROM parties; SELECT COUNT(*) as 'Admins' FROM admins;"
echo.
pause

