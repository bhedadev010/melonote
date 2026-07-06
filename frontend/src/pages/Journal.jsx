import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

function Journal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const isAuthenticated = Boolean(localStorage.getItem('melonote-token'));

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
      <>
        <div className="landing-bg" />
        <div className="landing-grid" />
        <div className="landing-noise" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="fixed top-6 left-6 z-50">
          <span className="text-2xl font-semibold tracking-tight tracking-wide" style={{ fontFamily: 'system-ui', color: '#cce6ff' }}>melonote</span>
        </div>

        <div className="relative min-h-screen px-4 pt-24 pb-12">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse mx-auto" />
            <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
            <div className="space-y-3 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Background layers */}
      <div className="landing-bg" />
      <div className="landing-grid" />
      <div className="landing-noise" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Top-left logo */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate(isAuthenticated ? '/home' : '/landing')}
          className="text-2xl font-semibold tracking-tight transition-opacity hover:opacity-80 tracking-wide"
          style={{ fontFamily: 'system-ui', color: '#cce6ff' }}
        >
          melonote
        </button>
      </div>

      <div className="relative min-h-screen px-4 pt-24 pb-12">
        <motion.div
          className="mx-auto max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Header */}
          <motion.div variants={fadeUp} custom={0} className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-2">Journal</p>
            <h1 className="text-3xl sm:text-4xl font-light text-white/80 mb-2">
              Welcome, {user?.name || 'friend'}
            </h1>
            <p className="text-sm text-white/40">Your personal space for reflection.</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} custom={1} className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/editor"
              className="group rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span>New journal entry</span>
            </Link>
            <Link
              to="/chat"
              className="group rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-white/[0.2] hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 013 21V12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span>Chat with AI</span>
            </Link>
          </motion.div>

          {/* Recent Entries */}
          <motion.div variants={fadeUp} custom={2}>
            <h2 className="text-lg font-semibold text-white/80 mb-4">Recent entries</h2>
            {entries.length === 0 ? (
              <p className="text-sm text-white/40">No saved entries yet. Start writing!</p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="glass glass-hover rounded-2xl p-5 sm:p-6"
                    >
                      <Link to={`/editor?entry=${entry._id}`} className="block">
                        <p className="text-sm font-medium text-white/90 mb-2">{entry.title}</p>
                        <p className="text-sm text-white/40 line-clamp-3 mb-3">{entry.fullText}</p>
                        <p className="text-xs text-white/20">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={(event) => handleDeleteEntry(entry._id, event)}
                        disabled={deletingId === entry._id}
                        className="mt-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white/80 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {deletingId === entry._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-3 text-sm font-medium shadow-lg ${
              toast.type === 'error' ? 'bg-red-500/90 text-white' :
              toast.type === 'info' ? 'bg-white/10 text-white/80 border border-white/10' :
              'bg-emerald-500/90 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Journal;