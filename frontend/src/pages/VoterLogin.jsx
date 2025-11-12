import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function VoterLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mock12DigitId: '',
    mockVoterId: '',
    mockPhone: '',
    termsAccepted: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Request OTP for demo mobile flow
      const response = await axios.post(
        '/api/voter/request-otp',
        {
          mock12DigitId: formData.mock12DigitId,
          mockVoterId: formData.mockVoterId,
          mockPhone: formData.mockPhone
        },
        { withCredentials: true }
      );

      if (response.data && response.data.requiresOtp) {
        setOtpRequired(true);
      } else if (response.data && response.data.success) {
        // fallback to direct login
        navigate('/voter/vote');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const resp = await axios.post('/api/voter/verify-otp', { otpCode }, { withCredentials: true });
      if (resp.data && resp.data.success) {
        navigate('/voter/vote');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await axios.post('/api/voter/resend-otp', {}, { withCredentials: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Voter Login" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              Voter Authentication
            </h2>


            {error && (
              <div className="glass-strong border-l-4 border-red-600 p-4 mb-6 rounded-r">
                <p className="text-red-900 font-semibold">{error}</p>
              </div>
            )}

            {!otpRequired ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="mock12DigitId" className="block text-lg font-semibold text-gray-700 mb-2">
                    Aadhaar 12-Digit ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="mock12DigitId"
                    name="mock12DigitId"
                    value={formData.mock12DigitId}
                    onChange={handleChange}
                    required
                    maxLength="12"
                    pattern="[0-9]{12}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-primary"
                    placeholder="Enter 12-digit mock ID"
                  />
                </div>

                <div>
                  <label htmlFor="mockVoterId" className="block text-lg font-semibold text-gray-700 mb-2">
                   Voter ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="mockVoterId"
                    name="mockVoterId"
                    value={formData.mockVoterId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-primary"
                    placeholder="Enter mock Voter ID"
                  />
                </div>

                <div>
                  <label htmlFor="mockPhone" className="block text-lg font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="mockPhone"
                    name="mockPhone"
                    value={formData.mockPhone}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-primary"
                    placeholder="Enter 10-digit mock phone"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                    className="mt-2 w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="termsAccepted" className="ml-3 text-lg text-gray-700">
                    I accept the Terms & Conditions <span className="text-red-600">*</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Requesting OTP...' : 'Request OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-700">Enter the 6-digit OTP sent to your phone.</p>
                </div>

                <div>
                  <label htmlFor="otpCode" className="block text-lg font-semibold text-gray-700 mb-2">OTP Code</label>
                  <input
                    type="text"
                    id="otpCode"
                    name="otpCode"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center focus:outline-none focus:border-primary"
                    placeholder="000000"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? 'Resending...' : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <a href="/" className="text-primary hover:underline text-lg">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VoterLogin;



