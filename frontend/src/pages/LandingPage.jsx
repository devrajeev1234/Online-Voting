import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gov-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-4xl font-bold text-gov-blue mb-6 text-center">
              Welcome to the Online Voting System
            </h2>
            <p className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
              This system demonstrates the user interface and basic functionality of an online voting platform.
              Please select your role to continue.
            </p>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Link
                to="/voter/login"
                className="bg-gov-blue hover:bg-gov-light-blue text-white font-bold py-8 px-8 rounded-lg shadow-lg text-center text-2xl transition duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">👤</div>
                <div className="text-3xl mb-2">Voter Login</div>
                <div className="text-lg opacity-90">Cast your vote</div>
              </Link>

              <Link
                to="/admin/login"
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-8 px-8 rounded-lg shadow-lg text-center text-2xl transition duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">🔐</div>
                <div className="text-3xl mb-2">Admin Login</div>
                <div className="text-lg opacity-90">Manage system</div>
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gov-blue mb-4">Instructions</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-gov-blue mr-3 font-bold">•</span>
                <span><strong>Voters:</strong> Use mock credentials from seed data (e.g., Mock ID: 111122223333, VoterID: VOTER001, Phone: 9000000001)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gov-blue mr-3 font-bold">•</span>
                <span><strong>Admins:</strong> Username: <code className="bg-gray-200 px-2 py-1 rounded">nihal</code>, Password: <code className="bg-gray-200 px-2 py-1 rounded">1234567</code></span>
              </li>
              <li className="flex items-start">
                <span className="text-gov-blue mr-3 font-bold">•</span>
                <span><strong>OTP:</strong> When enabled, OTP codes are printed to the server console (no SMS sending)</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gov-blue text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2024 Online Voting System</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;


