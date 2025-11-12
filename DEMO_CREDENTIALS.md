# Demo Credentials - Default Login Information

## ⚠️ DEMO PROTOTYPE ONLY - NOT FOR PRODUCTION

---

## Admin Login

**Username:** `nihal`  
**Password:** `1234567`

**Optional OTP:** If enabled, check the backend console/terminal for the 6-digit OTP code (no SMS sent).

---

## Voter Login - Demo Accounts

All IDs below are **FAKE/MOCK identifiers** for testing only.

### Voter Account 1 (Available)
- **Mock 12-Digit ID:** `111122223333`
- **Mock Voter ID:** `VOTER001`
- **Mock Phone:** `9000000001`
- **Status:** Can vote ✅

### Voter Account 2 (Available)
- **Mock 12-Digit ID:** `111122223334`
- **Mock Voter ID:** `VOTER002`
- **Mock Phone:** `9000000002`
- **Status:** Can vote ✅

### Voter Account 3 (Available)
- **Mock 12-Digit ID:** `111122223335`
- **Mock Voter ID:** `VOTER003`
- **Mock Phone:** `9000000003`
- **Status:** Can vote ✅

### Voter Account 4 (Available)
- **Mock 12-Digit ID:** `111122223336`
- **Mock Voter ID:** `VOTER004`
- **Mock Phone:** `9000000004`
- **Status:** Can vote ✅

### Voter Account 5 (Available)
- **Mock 12-Digit ID:** `111122223337`
- **Mock Voter ID:** `VOTER005`
- **Mock Phone:** `9000000005`
- **Status:** Can vote ✅

### Voter Account 6 (Available)
- **Mock 12-Digit ID:** `111122223338`
- **Mock Voter ID:** `VOTER006`
- **Mock Phone:** `9000000006`
- **Status:** Can vote ✅

### Voter Account 7 (Already Voted - For Testing)
- **Mock 12-Digit ID:** `111122223339`
- **Mock Voter ID:** `VOTER007`
- **Mock Phone:** `9000000007`
- **Status:** ❌ Already voted (to test "cannot vote twice" functionality)

### Voter Account 8 (Available)
- **Mock 12-Digit ID:** `111122223340`
- **Mock Voter ID:** `VOTER008`
- **Mock Phone:** `9000000008`
- **Status:** Can vote ✅

### Voter Account 9 (Available)
- **Mock 12-Digit ID:** `111122223341`
- **Mock Voter ID:** `VOTER009`
- **Mock Phone:** `9000000009`
- **Status:** Can vote ✅

### Voter Account 10 (Available)
- **Mock 12-Digit ID:** `111122223342`
- **Mock Voter ID:** `VOTER010`
- **Mock Phone:** `9000000010`
- **Status:** Can vote ✅

---

## Quick Test Credentials

**Recommended for quick testing:**

### Admin:
- Username: `nihal`
- Password: `1234567`

### Voter (First Account):
- Mock 12-Digit ID: `111122223333`
- Voter ID: `VOTER001`
- Phone: `9000000001`

---

## Database Credentials (MySQL)

**Default Configuration:**
- **Host:** `localhost`
- **Username:** `root`
- **Password:** `Devrajeev1234` (your MySQL root password)
- **Database:** `vote_system_demo`

Update `backend/.env` with your actual MySQL password.

---

## Important Notes

1. **All identifiers are MOCK/FAKE** - Do not use real Aadhaar IDs or phone numbers
2. **VOTER007 is pre-voted** - Use this to test the "already voted" message
3. **Terms & Conditions checkbox** - Must be checked for voter login
4. **OTP codes** - Printed to backend console, not sent via SMS
5. **Single vote enforcement** - Each voter can only vote once

---

## Using the Credentials

### Voter Login Steps:
1. Go to http://localhost:3000
2. Click "Voter Login"
3. Enter:
   - Mock 12-Digit ID: `111122223333`
   - Mock Voter ID: `VOTER001`
   - Mock Phone: `9000000001`
4. ✅ Check "Terms & Conditions"
5. Click "Login & Proceed to Vote"

### Admin Login Steps:
1. Go to http://localhost:3000
2. Click "Admin Login"
3. Enter:
   - Username: `nihal`
   - Password: `1234567`
4. (Optional) Check "Require OTP" - then check backend console for code
5. Click "Login"



