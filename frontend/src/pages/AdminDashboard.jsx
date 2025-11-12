import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({ name: '', symbolUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, partiesResponse] = await Promise.all([
        axios.get('/api/admin/stats', { withCredentials: true }),
        axios.get('/api/parties')
      ]);

      setStats(statsResponse.data);
      setParties(partiesResponse.data.parties || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddParty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post(
        '/api/admin/parties',
        {
          name: newParty.name,
          symbolUrl: newParty.symbolUrl || null
        },
        { withCredentials: true }
      );

      setNewParty({ name: '', symbolUrl: '' });
      setShowAddParty(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add party.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteParty = async (partyId, partyName) => {
    if (!window.confirm(`Are you sure you want to delete "${partyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/api/admin/parties/${partyId}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete party.');
    }
  };

  const handleLogout = () => {
    // Clear session on client side
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-cream">
        <Header title="Admin Dashboard" />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-cream">
      <Header title="Admin Dashboard" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gov-blue">Administration Panel</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-r">
              <p className="text-red-900 font-semibold">{error}</p>
            </div>
          )}

          {/* Statistics */}
          {stats && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gov-blue mb-6">Voting Statistics</h3>
              
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-700">{stats.totals.totalVotes}</div>
                  <div className="text-gray-600">Total Votes</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-700">{stats.totals.votedCount}</div>
                  <div className="text-gray-600">Voters Voted</div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-700">{stats.totals.remainingVoters}</div>
                  <div className="text-gray-600">Remaining</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <div className="text-3xl font-bold text-purple-700">{stats.nota.vote_count}</div>
                  <div className="text-gray-600">NOTA Votes</div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-700 mb-4">Party-wise Results</h4>
                <div className="space-y-3">
                  {stats.parties.map((party) => (
                    <div key={party.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-800">{party.name}</div>
                        {party.symbol_url && (
                          <img
                            src={party.symbol_url}
                            alt={`${party.name} symbol`}
                            className="h-12 mt-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-gov-blue">{party.vote_count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Party Management */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gov-blue">Party Management</h3>
              <button
                onClick={() => setShowAddParty(!showAddParty)}
                className="bg-gov-blue hover:bg-gov-light-blue text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                {showAddParty ? 'Cancel' : '+ Add Party'}
              </button>
            </div>

            {showAddParty && (
              <form onSubmit={handleAddParty} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label htmlFor="partyName" className="block text-lg font-semibold text-gray-700 mb-2">
                    Party Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="partyName"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-gov-blue"
                    placeholder="Enter party name"
                  />
                </div>

                <div>
                  <label htmlFor="symbolUrl" className="block text-lg font-semibold text-gray-700 mb-2">
                    Symbol URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="symbolUrl"
                    value={newParty.symbolUrl}
                    onChange={(e) => setNewParty({ ...newParty, symbolUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-gov-blue"
                    placeholder="https://example.com/party-symbol.png"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Party'}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {parties.map((party) => (
                <div key={party.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-800">{party.name}</div>
                    {party.symbol_url && (
                      <img
                        src={party.symbol_url}
                        alt={`${party.name} symbol`}
                        className="h-12 mt-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteParty(party.id, party.name)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;



