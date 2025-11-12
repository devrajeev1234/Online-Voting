import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-6">
              <div className="bg-white/20 backdrop-blur-lg rounded-full p-6 shadow-glow">
                <span className="text-7xl">🗳️</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
              Secure Online Voting
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              A modern, user-friendly voting platform demonstration. Experience the future of democratic participation.
            </p>
            
            {/* Warning Banner */}
            <div className="glass-strong max-w-3xl mx-auto mb-12 animate-slide-in">
              <div className="flex items-center justify-center gap-3 p-4">
                <span className="text-3xl">⚠️</span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-red-600 mb-1">DEMO PROTOTYPE - DEVELOPMENT ONLY</h3>
                  <p className="text-sm text-gray-700">
                    This is a prototype for UX testing. <strong>DO NOT use for real elections or store real personal data.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Link
              to="/voter/login"
              className="glass-strong p-10 rounded-2xl card-hover group animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-5xl">👤</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Voter Login</h2>
                <p className="text-gray-600 mb-6 text-lg">Cast your vote securely and easily</p>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                  Get Started →
                </div>
              </div>
            </Link>

            <Link
              to="/admin/login"
              className="glass-strong p-10 rounded-2xl card-hover group animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-full p-6 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-5xl">🔐</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Admin Login</h2>
                <p className="text-gray-600 mb-6 text-lg">Manage voting process and view results</p>
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                  Enter Dashboard →
                </div>
              </div>
            </Link>
          </div>

          {/* Instructions */}
          <div className="glass-strong rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">📋 Demo Instructions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="text-2xl mb-3">👥</div>
                <h4 className="font-bold text-gray-800 mb-2">Voters</h4>
                <p className="text-sm text-gray-600">
                  Use mock credentials: <br />
                  <code className="text-xs">ID: 111122223333</code><br />
                  <code className="text-xs">VoterID: VOTER001</code><br />
                  <code className="text-xs">Phone: 9000000001</code>
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                <div className="text-2xl mb-3">🔑</div>
                <h4 className="font-bold text-gray-800 mb-2">Admins</h4>
                <p className="text-sm text-gray-600">
                  Username: <code className="bg-white px-2 py-1 rounded">nihal</code><br />
                  Password: <code className="bg-white px-2 py-1 rounded">1234567</code>
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="text-2xl mb-3">📱</div>
                <h4 className="font-bold text-gray-800 mb-2">OTP</h4>
                <p className="text-sm text-gray-600">
                  OTP codes are printed to the server console (no SMS sending in demo)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center">
        <div className="glass-strong max-w-4xl mx-auto rounded-xl p-6">
          <p className="text-gray-700">
            © 2024 Demo Voting System Prototype | For Development and Testing Only
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;


