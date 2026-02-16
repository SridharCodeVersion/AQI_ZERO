# AQI ZERO - Database Setup Guide

## Quick Fix for DATABASE_URL Error

I've created a `.env` file for you. You have **two options**:

### Option 1: Use SQLite (Easiest - No PostgreSQL needed)

If you don't have PostgreSQL installed or want to test quickly, we can modify the app to use SQLite instead.

**Would you like me to set this up?** (Just say "yes" and I'll configure it)

### Option 2: Use PostgreSQL (Recommended for production)

If you have PostgreSQL installed:

1. **Install PostgreSQL** (if not already installed):
   - Download from: https://www.postgresql.org/download/windows/
   - Or use: `winget install PostgreSQL.PostgreSQL`

2. **Create the database**:
   ```powershell
   # Open PostgreSQL command line (psql)
   psql -U postgres
   
   # Create database
   CREATE DATABASE aqi_zero;
   
   # Exit
   \q
   ```

3. **Update the `.env` file** with your credentials:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/aqi_zero
   ```
   Replace `YOUR_PASSWORD` with your PostgreSQL password.

4. **Push the database schema**:
   ```powershell
   npm run db:push
   ```

5. **Run the app**:
   ```powershell
   npm run dev
   ```

## Current .env Configuration

The `.env` file has been created with default values:
- Database: `postgresql://postgres:password@localhost:5432/aqi_zero`
- Port: `5000`
- Environment: `development`

---

**Choose your option and let me know!** I recommend Option 1 (SQLite) for quick testing.
