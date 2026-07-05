import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Journal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('melonote-token');
    if (!token) {
      navigate('/auth', { replace: true });
      return;
    }

    Promise.all([
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get('/journal/entries', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([userResponse, entriesResponse]) => {
        setUser(userResponse.data.user);
        setEntries(entriesResponse.data.entries || []);
      })
      .catch(() => {
        localStorage.removeItem('melonote-token');
        localStorage.removeItem('melonote-user');
        navigate('/auth', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleDeleteEntry(entryId, event) {
    event.preventDefault();
    event.stopPropagation();

    if (!window.confirm('Delete this saved entry?')) {
      return;
    }

    setDeletingId(entryId);
    try {
      await api.delete(`/journal/entries/${entryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('melonote-token')}` },
      });
      setEntries((current) => current.filter((entry) => entry._id !== entryId));
      showToast('Entry deleted.');
    } catch (error) {
      showToast('Could not delete this entry.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
          <div className="h-12 w-40 bg-gray-100 rounded-full" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm animate-fade-in">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-wide text-sky-500">Journal</p>
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user?.name || 'friend'}</h1>
          <p className="text-sm text-gray-500 mt-2">Your personal space for reflection.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/editor"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-sky-600 hover:scale-105 active:scale-95"
          >
            New journal entry
          </Link>
          <Link
            to="/chat"
            className="rounded-full border border-sky-500 px-4 py-2 text-sm font-medium text-sky-600 transition-all hover:bg-sky-50 hover:scale-105 active:scale-95"
          >
            Chat with AI
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
          >
            View dashboard
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">Recent entries</h2>
          {entries.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No saved entries yet. Start writing!</p>
          ) : (
            <div className="mt-4 space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={entry._id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-sky-200 hover:bg-sky-50 hover:shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={`/editor?entry=${entry._id}`} className="block">
                    <p className="text-sm font-medium text-gray-700">{entry.title}</p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{entry.fullText}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={(event) => handleDeleteEntry(entry._id, event)}
                    disabled={deletingId === entry._id}
                    className="mt-3 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-all hover:bg-white hover:scale-105 disabled:opacity-50"
                  >
                    {deletingId === entry._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-3 text-sm font-medium shadow-lg animate-slide-up ${
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'info' ? 'bg-slate-800 text-white' :
            'bg-emerald-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Journal;