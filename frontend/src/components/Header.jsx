import React from 'react';

function Header({ title = 'Online Voting System' }) {
  return (
    <header className="bg-gov-blue text-white py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded">
              <div className="w-12 h-12 bg-gov-blue rounded flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🗳️</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;



