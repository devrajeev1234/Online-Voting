import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    requireOtp: false
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/admin/login',
        {
          username: formData.username,
          password: formData.password,
          requireOtp: formData.requireOtp
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.requiresOtp) {
          setOtpRequired(true);
          setError('');
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/admin/verify-otp',
        { otpCode },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Admin Login" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              Administrator Access
            </h2>

            <div className="glass-strong border-l-4 border-yellow-600 p-4 mb-6 rounded-r">
              <p className="text-sm text-yellow-900">
                <strong>DEMO CREDENTIALS:</strong> Username: <code className="bg-yellow-200 px-2 py-1 rounded">nihal</code>, Password: <code className="bg-yellow-200 px-2 py-1 rounded">1234567</code>
                <br />
                <strong>OTP:</strong> If enabled, OTP code will be printed to server console (check terminal)
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 p-4 mb-6 rounded-r">
                <p className="text-red-900 font-semibold">{error}</p>
              </div>
            )}

            {!otpRequired ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-2">
                    Username <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-primary"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-primary"
                    placeholder="Enter password"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="requireOtp"
                    name="requireOtp"
                    checked={formData.requireOtp}
                    onChange={handleChange}
                    className="mt-2 w-5 h-5 text-gov-blue focus:ring-gov-blue border-gray-300 rounded"
                  />
                  <label htmlFor="requireOtp" className="ml-3 text-lg text-gray-700">
                    Require OTP verification (DEMO: Code printed to server console)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div className="bg-blue-100 border-l-4 border-blue-600 p-4 mb-6 rounded-r">
                  <p className="text-blue-900 font-semibold">
                    OTP code has been generated. Check the server console/terminal for the code.
                  </p>
                </div>

                <div>
                  <label htmlFor="otpCode" className="block text-lg font-semibold text-gray-700 mb-2">
                    Enter OTP Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="otpCode"
                    name="otpCode"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      setError('');
                    }}
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center text-2xl tracking-widest focus:outline-none focus:border-gov-blue"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpRequired(false);
                    setOtpCode('');
                    setError('');
                  }}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Back to Login
                </button>
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

export default AdminLogin;



