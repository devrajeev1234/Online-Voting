// DEMO PROTOTYPE ONLY - Integration Tests
// Tests for voting flow and single-vote enforcement

const request = require('supertest');
const app = require('../server');
const mysql = require('mysql2/promise');

const TEST_DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vote_system_demo'
};

describe('Voting System Integration Tests', () => {
  let connection;
  let testVoterId;
  let testPartyId;

  beforeAll(async () => {
    connection = await mysql.createConnection(TEST_DB_CONFIG);
    
    // Create a test voter (not voted)
    const [result] = await connection.execute(
      `INSERT INTO voters (mock_12_digit_id, mock_voter_id, mock_phone, has_voted) 
       VALUES (?, ?, ?, FALSE)`,
      ['999999999999', 'TESTVOTER', '9999999999']
    );
    testVoterId = result.insertId;

    // Get a test party
    const [parties] = await connection.execute('SELECT id FROM parties LIMIT 1');
    if (parties.length > 0) {
      testPartyId = parties[0].id;
    }
  });

  afterAll(async () => {
    // Cleanup test data
    if (connection) {
      await connection.execute('DELETE FROM votes WHERE voter_id = ?', [testVoterId]);
      await connection.execute('DELETE FROM voters WHERE id = ?', [testVoterId]);
      await connection.end();
    }
  });

  describe('Voter Login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/voter/login')
        .send({
          mock12DigitId: '999999999999',
          mockVoterId: 'TESTVOTER',
          mockPhone: '9999999999',
          termsAccepted: true
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject login without terms acceptance', async () => {
      const response = await request(app)
        .post('/api/voter/login')
        .send({
          mock12DigitId: '999999999999',
          mockVoterId: 'TESTVOTER',
          mockPhone: '9999999999',
          termsAccepted: false
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Terms');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/voter/login')
        .send({
          mock12DigitId: '000000000000',
          mockVoterId: 'INVALID',
          mockPhone: '0000000000',
          termsAccepted: true
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('Vote Submission', () => {
    let sessionCookie;

    beforeEach(async () => {
      // Login first to get session
      const loginResponse = await request(app)
        .post('/api/voter/login')
        .send({
          mock12DigitId: '999999999999',
          mockVoterId: 'TESTVOTER',
          mockPhone: '9999999999',
          termsAccepted: true
        });

      sessionCookie = loginResponse.headers['set-cookie'];
    });

    test('should submit vote successfully', async () => {
      const response = await request(app)
        .post('/api/voter/vote')
        .set('Cookie', sessionCookie)
        .send({
          partyId: testPartyId,
          isNota: false
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify vote was recorded
      const [votes] = await connection.execute(
        'SELECT * FROM votes WHERE voter_id = ?',
        [testVoterId]
      );
      expect(votes.length).toBe(1);

      // Verify voter marked as voted
      const [voters] = await connection.execute(
        'SELECT has_voted FROM voters WHERE id = ?',
        [testVoterId]
      );
      expect(voters[0].has_voted).toBe(true);
    });

    test('should prevent double voting', async () => {
      // Try to vote again (should fail)
      const response = await request(app)
        .post('/api/voter/vote')
        .set('Cookie', sessionCookie)
        .send({
          partyId: testPartyId,
          isNota: false
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('already voted');
    });

    test('should submit NOTA vote', async () => {
      // Create another test voter for NOTA test
      const [result] = await connection.execute(
        `INSERT INTO voters (mock_12_digit_id, mock_voter_id, mock_phone, has_voted) 
         VALUES (?, ?, ?, FALSE)`,
        ['888888888888', 'TESTVOTER2', '8888888888']
      );
      const notaVoterId = result.insertId;

      // Login
      const loginResponse = await request(app)
        .post('/api/voter/login')
        .send({
          mock12DigitId: '888888888888',
          mockVoterId: 'TESTVOTER2',
          mockPhone: '8888888888',
          termsAccepted: true
        });

      const notaSessionCookie = loginResponse.headers['set-cookie'];

      // Submit NOTA
      const voteResponse = await request(app)
        .post('/api/voter/vote')
        .set('Cookie', notaSessionCookie)
        .send({
          isNota: true
        });

      expect(voteResponse.status).toBe(200);

      // Cleanup
      await connection.execute('DELETE FROM votes WHERE voter_id = ?', [notaVoterId]);
      await connection.execute('DELETE FROM voters WHERE id = ?', [notaVoterId]);
    });
  });

  describe('Admin Routes', () => {
    test('should login admin with correct credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'nihal',
          password: '1234567',
          requireOtp: false
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject admin login with wrong credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'nihal',
          password: 'wrongpassword',
          requireOtp: false
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Party Management', () => {
    let adminSessionCookie;
    let testPartyIdToDelete;

    beforeAll(async () => {
      // Login as admin
      const loginResponse = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'nihal',
          password: '1234567',
          requireOtp: false
        });

      adminSessionCookie = loginResponse.headers['set-cookie'];
    });

    test('should add a new party', async () => {
      const response = await request(app)
        .post('/api/admin/parties')
        .set('Cookie', adminSessionCookie)
        .send({
          name: 'Test Party',
          symbolUrl: 'https://example.com/symbol.png'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      testPartyIdToDelete = response.body.partyId;
    });

    test('should delete a party', async () => {
      if (!testPartyIdToDelete) return;

      const response = await request(app)
        .delete(`/api/admin/parties/${testPartyIdToDelete}`)
        .set('Cookie', adminSessionCookie);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});



