import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function VotePage() {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [isNota, setIsNota] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await axios.get('/api/parties');
      setParties(response.data.parties || []);
    } catch (err) {
      setError('Failed to load parties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePartySelect = (partyId) => {
    setSelectedParty(partyId);
    setIsNota(false);
  };

  const handleNotaSelect = () => {
    setIsNota(true);
    setSelectedParty(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedParty && !isNota) {
      setError('Please select a party or NOTA option');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await axios.post(
        '/api/voter/vote',
        {
          partyId: selectedParty,
          isNota: isNota
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-2xl mx-4">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-4xl font-bold text-primary mb-4">Vote Submitted Successfully!</h2>
          <p className="text-xl text-gray-700 mb-6">
            Thank you for participating in this demo voting system.
          </p>
          <p className="text-lg text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Cast Your Vote" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              Select Your Choice
            </h2>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 p-4 mb-6 rounded-r">
                <p className="text-red-900 font-semibold">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading parties...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-8">
                  {parties.map((party) => (
                    <label
                      key={party.id}
                      className={`block p-6 border-4 rounded-lg cursor-pointer transition duration-200 ${
                        selectedParty === party.id
              ? 'border-primary bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="party"
                          value={party.id}
                          checked={selectedParty === party.id}
                          onChange={() => handlePartySelect(party.id)}
                          className="w-6 h-6 text-primary focus:ring-primary mr-4"
                        />
                        <div className="flex-1">
                          <div className="text-2xl font-bold text-gov-blue">
                            {party.name}
                          </div>
                          {party.symbol_url && (
                            <img
                              src={party.symbol_url}
                              alt={`${party.name} symbol`}
                              className="h-16 mt-2"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}

                  {/* NOTA Option */}
                  <label
                    className={`block p-6 border-4 rounded-lg cursor-pointer transition duration-200 ${
                      isNota
              ? 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="party"
                        checked={isNota}
                        onChange={handleNotaSelect}
                        className="w-6 h-6 text-red-600 focus:ring-red-600 mr-4"
                      />
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-red-600">
                          NOTA (None of the Above)
                        </div>
                        <p className="text-gray-600 mt-2">
                          Select this option if you do not wish to vote for any of the listed parties.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 mb-6 rounded-r">
                  <p className="text-yellow-900 font-semibold">
                    ⚠️ You can only vote once. This action cannot be undone.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || (!selectedParty && !isNota)}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting Vote...' : 'Submit Vote'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <a href="/" className="text-gov-blue hover:underline text-lg">
                Cancel and Return Home
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VotePage;



