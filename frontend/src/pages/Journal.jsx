import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Journal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('melonote-token');
    if (!token) {
      navigate('/auth', { replace: true });
      return;
    }

    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('melonote-token');
        localStorage.removeItem('melonote-user');
        navigate('/auth', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('melonote-token');
    localStorage.removeItem('melonote-user');
    navigate('/auth', { replace: true });
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-gray-500">Loading your journal space…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-sky-500">Journal</p>
            <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user?.name || 'friend'}</h1>
            <p className="text-sm text-gray-500 mt-2">Your journal is ready for the next milestone.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <div className="rounded-2xl bg-sky-50 p-6 text-sm text-sky-800">
          Milestone 3 is now available. You can open the journal editor to draft your reflections, generate a spark idea, and save your current draft locally.
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/editor" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
            Open journal editor
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Journal;
