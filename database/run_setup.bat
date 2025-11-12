@echo off
REM Database Setup Script - Run this from the database folder
REM Make sure to update the MySQL path below if needed

echo ====================================
echo Database Setup for Vote System Demo
echo ====================================
echo.

REM Update this path to your MySQL installation
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe

REM Check if MySQL exists at default location
if not exist "%MYSQL_PATH%" (
    echo ERROR: MySQL not found at default location.
    echo Please update MYSQL_PATH in this script to point to your mysql.exe
    echo Common locations:
    echo   - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    echo   - C:\xampp\mysql\bin\mysql.exe
    echo   - C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe
    pause
    exit /b 1
)

echo Step 1: Creating database and tables...
"%MYSQL_PATH%" -u root -p < schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database. Please check your MySQL credentials.
    pause
    exit /b 1
)

echo.
echo Step 2: Seeding database with demo data...
"%MYSQL_PATH%" -u root -p < seed.sql
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
"%MYSQL_PATH%" -u root -pDevrajeev1234 -e "USE vote_system_demo; SELECT COUNT(*) as 'Voters' FROM voters; SELECT COUNT(*) as 'Parties' FROM parties; SELECT COUNT(*) as 'Admins' FROM admins;"
echo.
pause



