import React from 'react';
import { Link } from 'react-router-dom';

function Header({ title = 'Online Voting System' }) {
  return (
    <header className="bg-gradient-to-r from-primary/90 to-secondary/80 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-3 glass p-2 rounded-xl">
              <div className="bg-white/20 p-2 rounded-full">
                <span className="text-white text-2xl">🗳️</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/voter/login" className="text-sm font-medium glass px-3 py-2 rounded-full">
              Voter Login
            </Link>
            <Link to="/admin/login" className="text-sm font-medium glass px-3 py-2 rounded-full">
              Admin
            </Link>
            <a href="/" className="text-sm glass px-3 py-2 rounded-full">About</a>
          </nav>

          <div className="md:hidden">
            <button aria-label="open menu" className="glass px-3 py-2 rounded-md text-sm">Menu</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;



