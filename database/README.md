# Database Setup - DEMO PROTOTYPE ONLY

## ⚠️ WARNING
**This is a DEMO PROTOTYPE for development/testing only.**
- Do NOT use in production
- Do NOT store real personal data
- All identifiers are MOCK/FAKE for demonstration purposes only

## Setup Instructions

1. Make sure MySQL is installed and running on your system.

2. Create the database and tables:
   ```bash
   mysql -u root -p < schema.sql
   ```

3. Seed the database with demo data:
   ```bash
   mysql -u root -p < seed.sql
   ```

4. Verify the data:
   ```bash
   mysql -u root -p vote_system_demo -e "SELECT COUNT(*) FROM voters; SELECT COUNT(*) FROM parties;"
   ```

## Demo Credentials

**Admin Login:**
- Username: `nihal`
- Password: `1234567`

**Demo Voters (all fake IDs):**
- Mock 12-digit ID: `111122223333`, VoterID: `VOTER001`, Phone: `9000000001`
- Mock 12-digit ID: `111122223334`, VoterID: `VOTER002`, Phone: `9000000002`
- ... (see seed.sql for all)

## Security Notes

- All passwords are stored in plain text for demo purposes (MUST be replaced with bcrypt in production)
- No real OTP sending - codes are printed to server console only
- All IDs are mock/fake identifiers
- Transaction-based voting enforcement prevents double voting



