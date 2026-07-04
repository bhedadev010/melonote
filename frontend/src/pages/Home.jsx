import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';

function Home() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch(() => setError('Unable to reach the server'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-800 mb-4">
          Welcome to Melonote
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          A calm space for personal reflection and meaningful insights.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm mx-auto">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
          System Status
        </h2>

        {loading && (
          <p className="text-gray-400 animate-pulse">Checking connection…</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {health && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-gray-700">API: {health.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  health.database === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
                }`}
              />
              <span className="text-gray-700">Database: {health.database}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
