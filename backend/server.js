// DEMO PROTOTYPE ONLY - DO NOT USE IN PRODUCTION
// This is a development/testing prototype for UX demonstration
// NEVER store real Aadhaar IDs, real phone numbers, or real voter data

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DEMO: Session-based auth (DEPRECATED for production - use JWT or OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'demo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // DEMO: Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database connection pool
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vote_system_demo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// DEMO: OTP storage in memory (for demo only - not production-ready)
const otpStore = new Map(); // { sessionId: { code, expires } }

// Helper: Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Format phone number for SMS delivery
function formatPhoneForSms(rawPhone) {
  if (!rawPhone) return rawPhone;
  const trimmed = rawPhone.trim();
  // If already E.164 (starts with +), return as-is
  if (trimmed.startsWith('+')) return trimmed;

  // If DEFAULT_PHONE_COUNTRY_CODE is set in env, prepend it
  const defaultCode = process.env.DEFAULT_PHONE_COUNTRY_CODE;
  if (defaultCode) {
    return `${defaultCode}${trimmed}`;
  }

  // Fallback: return raw value (may fail at provider level)
  return trimmed;
}

// Helper: Send SMS via Twilio if configured, otherwise console.log the message (demo)
async function sendSms(to, body) {
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;

    if (sid && token && from) {
      // lazy-require to avoid hard dependency if not used
      const twilioClient = require('twilio')(sid, token);
      const msg = await twilioClient.messages.create({ body, from, to });
      console.log(`SMS sent via Twilio: sid=${msg.sid} to=${to}`);
      return { success: true, sid: msg.sid };
    }

    console.log(`SMS not configured. Message to ${to}: ${body}`);
    return { success: false, info: 'twilio-not-configured' };
  } catch (err) {
    console.error('Failed to send SMS:', err);
    return { success: false, error: err.message || String(err) };
  }
}

// ==================== VOTER ROUTES ====================

// POST /api/voter/login - Validate mock voter credentials
app.post('/api/voter/login', async (req, res) => {
  try {
    const { mock12DigitId, mockVoterId, mockPhone, termsAccepted } = req.body;

    // DEMO: Basic validation (REPLACE WITH SECURE VALIDATION in production)
    if (!mock12DigitId || !mockVoterId || !mockPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the Terms & Conditions' });
    }

    // Check voter exists and hasn't voted
    const [rows] = await dbPool.execute(
      `SELECT id, mock_12_digit_id, mock_voter_id, mock_phone, has_voted 
       FROM voters 
       WHERE mock_12_digit_id = ? AND mock_voter_id = ? AND mock_phone = ?`,
      [mock12DigitId, mockVoterId, mockPhone]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const voter = rows[0];

    if (voter.has_voted) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    // Set session for voter
    req.session.voterId = voter.id;
    req.session.voterVerified = true;

    res.json({
      success: true,
      message: 'Login successful',
      voterId: voter.id
    });
  } catch (error) {
    console.error('Voter login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/voter/request-otp - Generate OTP for voter (demo: printed to console)
app.post('/api/voter/request-otp', async (req, res) => {
  try {
    const { mock12DigitId, mockVoterId, mockPhone } = req.body;

    if (!mock12DigitId || !mockVoterId || !mockPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check voter exists and hasn't voted
    const [rows] = await dbPool.execute(
      `SELECT id, has_voted FROM voters WHERE mock_12_digit_id = ? AND mock_voter_id = ? AND mock_phone = ?`,
      [mock12DigitId, mockVoterId, mockPhone]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const voter = rows[0];

    if (voter.has_voted) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    // Generate OTP and store in memory (demo only)
    const otpCode = generateOTP();
    const sessionId = req.sessionID || `voter_${Date.now()}`;

    const toPhone = formatPhoneForSms(mockPhone || voter.mock_phone);

    otpStore.set(sessionId, {
      code: otpCode,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      voterId: voter.id,
      phone: toPhone
    });

    // Attach pending OTP session
    req.session.voterPendingOtp = sessionId;

    const message = `Your VoteSystem OTP is ${otpCode}. It is valid for 5 minutes.`;

    // Attempt to send SMS via provider (Twilio) if configured, otherwise log to console
    await sendSms(toPhone, message);

    res.json({ success: true, requiresOtp: true, message: 'OTP generated and (demo) sent.' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/voter/verify-otp - Verify the OTP for voter and create session
app.post('/api/voter/verify-otp', async (req, res) => {
  try {
    const { otpCode } = req.body;

    if (!otpCode) {
      return res.status(400).json({ error: 'OTP code is required' });
    }

    const sessionId = req.session.voterPendingOtp;

    if (!sessionId || !otpStore.has(sessionId)) {
      return res.status(400).json({ error: 'OTP session expired or invalid' });
    }

    const otpData = otpStore.get(sessionId);

    if (Date.now() > otpData.expires) {
      otpStore.delete(sessionId);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpData.code !== otpCode) {
      return res.status(401).json({ error: 'Invalid OTP code' });
    }

    // OTP verified - complete voter login
    req.session.voterId = otpData.voterId;
    req.session.voterVerified = true;
    req.session.voterPendingOtp = null;
    otpStore.delete(sessionId);

    res.json({ success: true, message: 'OTP verified. Login successful.', voterId: otpData.voterId });
  } catch (error) {
    console.error('Voter OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/voter/resend-otp - Regenerate OTP for the pending voter session
app.post('/api/voter/resend-otp', async (req, res) => {
  try {
    const sessionId = req.session.voterPendingOtp;

    if (!sessionId || !otpStore.has(sessionId)) {
      return res.status(400).json({ error: 'No pending OTP session' });
    }

    const otpData = otpStore.get(sessionId);

    // regenerate
    const otpCode = generateOTP();
    otpData.code = otpCode;
    otpData.expires = Date.now() + 5 * 60 * 1000;
    otpStore.set(sessionId, otpData);

    const message = `Your VoteSystem OTP is ${otpCode}. It is valid for 5 minutes.`;
    await sendSms(otpData.phone, message);

    res.json({ success: true, message: 'OTP resent (demo).' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/parties - List all parties
app.get('/api/parties', async (req, res) => {
  try {
    const [rows] = await dbPool.execute(
      'SELECT id, name, symbol_url FROM parties ORDER BY name'
    );
    res.json({ parties: rows });
  } catch (error) {
    console.error('Get parties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/voter/vote - Submit vote (with single-vote enforcement)
app.post('/api/voter/vote', async (req, res) => {
  const connection = await dbPool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check session
    if (!req.session.voterId || !req.session.voterVerified) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { partyId, isNota } = req.body;

    if (!isNota && !partyId) {
      return res.status(400).json({ error: 'Either partyId or isNota must be provided' });
    }

    // Check voter hasn't voted (double-check with transaction)
    const [voterRows] = await connection.execute(
      'SELECT id, has_voted FROM voters WHERE id = ? FOR UPDATE',
      [req.session.voterId]
    );

    if (voterRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Voter not found' });
    }

    if (voterRows[0].has_voted) {
      await connection.rollback();
      return res.status(403).json({ error: 'You have already voted' });
    }

    // Insert vote
    await connection.execute(
      'INSERT INTO votes (voter_id, party_id, is_nota) VALUES (?, ?, ?)',
      [req.session.voterId, isNota ? null : partyId, isNota || false]
    );

    // Mark voter as voted (atomic operation in transaction)
    await connection.execute(
      'UPDATE voters SET has_voted = TRUE WHERE id = ?',
      [req.session.voterId]
    );

    await connection.commit();

    // Clear session
    req.session.destroy();

    res.json({
      success: true,
      message: 'Vote submitted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
});

// ==================== ADMIN ROUTES ====================

// POST /api/admin/login - Admin authentication
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password, requireOtp } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // DEMO: Plain password comparison (DEPRECATED - use bcrypt in production)
    const [rows] = await dbPool.execute(
      'SELECT id, username, password_hash FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];

    // DEMO: Plain text password check (MUST REPLACE with bcrypt.compare in production)
    if (admin.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If OTP is required, generate and store it
    if (requireOtp) {
      const otpCode = generateOTP();
      const sessionId = req.sessionID || `admin_${Date.now()}`;
      
      otpStore.set(sessionId, {
        code: otpCode,
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
        adminId: admin.id
      });

      // DEMO: Print OTP to console (NO SMS sending)
      console.log(`\n=== DEMO OTP FOR ADMIN LOGIN ===`);
      console.log(`Username: ${username}`);
      console.log(`OTP Code: ${otpCode}`);
      console.log(`=================================\n`);

      req.session.adminPendingOtp = sessionId;

      return res.json({
        success: true,
        requiresOtp: true,
        message: 'OTP generated. Check server console for the code.'
      });
    }

    // Login successful without OTP
    req.session.adminId = admin.id;
    req.session.adminVerified = true;

    res.json({
      success: true,
      message: 'Login successful',
      adminId: admin.id
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/verify-otp - Verify OTP code
app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { otpCode } = req.body;

    if (!otpCode) {
      return res.status(400).json({ error: 'OTP code is required' });
    }

    const sessionId = req.session.adminPendingOtp;

    if (!sessionId || !otpStore.has(sessionId)) {
      return res.status(400).json({ error: 'OTP session expired or invalid' });
    }

    const otpData = otpStore.get(sessionId);

    if (Date.now() > otpData.expires) {
      otpStore.delete(sessionId);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpData.code !== otpCode) {
      return res.status(401).json({ error: 'Invalid OTP code' });
    }

    // OTP verified - complete login
    req.session.adminId = otpData.adminId;
    req.session.adminVerified = true;
    req.session.adminPendingOtp = null;
    otpStore.delete(sessionId);

    res.json({
      success: true,
      message: 'OTP verified. Login successful.',
      adminId: otpData.adminId
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware: Check admin authentication
function requireAdmin(req, res, next) {
  if (!req.session.adminId || !req.session.adminVerified) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  next();
}

// GET /api/admin/stats - Get voting statistics
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    // Get party vote counts
    const [partyVotes] = await dbPool.execute(
      `SELECT p.id, p.name, p.symbol_url, COUNT(v.id) as vote_count
       FROM parties p
       LEFT JOIN votes v ON p.id = v.party_id
       GROUP BY p.id, p.name, p.symbol_url
       ORDER BY vote_count DESC, p.name`
    );

    // Get NOTA count
    const [notaRows] = await dbPool.execute(
      'SELECT COUNT(*) as count FROM votes WHERE is_nota = TRUE'
    );
    const notaCount = notaRows[0].count;

    // Get total votes
    const [totalRows] = await dbPool.execute(
      'SELECT COUNT(*) as count FROM votes'
    );
    const totalVotes = totalRows[0].count;

    // Get total voters
    const [voterRows] = await dbPool.execute(
      'SELECT COUNT(*) as count FROM voters'
    );
    const totalVoters = voterRows[0].count;

    // Get voted count
    const [votedRows] = await dbPool.execute(
      'SELECT COUNT(*) as count FROM voters WHERE has_voted = TRUE'
    );
    const votedCount = votedRows[0].count;

    res.json({
      parties: partyVotes,
      nota: { name: 'NOTA', vote_count: parseInt(notaCount) },
      totals: {
        totalVotes: parseInt(totalVotes),
        totalVoters: parseInt(totalVoters),
        votedCount: parseInt(votedCount),
        remainingVoters: parseInt(totalVoters) - parseInt(votedCount)
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/parties - Add new party
app.post('/api/admin/parties', requireAdmin, async (req, res) => {
  try {
    const { name, symbolUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Party name is required' });
    }

    const [result] = await dbPool.execute(
      'INSERT INTO parties (name, symbol_url) VALUES (?, ?)',
      [name, symbolUrl || null]
    );

    res.json({
      success: true,
      message: 'Party added successfully',
      partyId: result.insertId
    });
  } catch (error) {
    console.error('Add party error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/parties/:id - Delete party
app.delete('/api/admin/parties/:id', requireAdmin, async (req, res) => {
  try {
    const partyId = parseInt(req.params.id);

    if (isNaN(partyId)) {
      return res.status(400).json({ error: 'Invalid party ID' });
    }

    // Check if party exists
    const [rows] = await dbPool.execute(
      'SELECT id FROM parties WHERE id = ?',
      [partyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Delete party (votes will be set to NULL due to ON DELETE SET NULL)
    await dbPool.execute(
      'DELETE FROM parties WHERE id = ?',
      [partyId]
    );

    res.json({
      success: true,
      message: 'Party deleted successfully'
    });
  } catch (error) {
    console.error('Delete party error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DEMO PROTOTYPE - Development only' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n=== DEMO VOTING SYSTEM BACKEND ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`⚠️  DEMO PROTOTYPE ONLY - DO NOT USE IN PRODUCTION\n`);
});

module.exports = app; // For testing



