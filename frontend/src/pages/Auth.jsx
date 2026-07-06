import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function Auth() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('melonote-token'));
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('melonote-token');
    if (token) {
      navigate('/journal', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('melonote-token', data.token);
      localStorage.setItem('melonote-user', JSON.stringify(data.user));
      navigate('/journal', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Background layers */}
      <div className="landing-bg" />
      <div className="landing-grid" />
      <div className="landing-noise" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Top-left logo */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate(isAuthenticated ? '/home' : '/landing')}
          className="text-2xl font-semibold text-gradient tracking-tight transition-opacity hover:opacity-80"
        >
          Melonote
        </button>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-sm"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Logo */}
          <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-tight text-white/80">
              <span className="text-gradient font-medium">Melonote</span>
            </h1>
          </motion.div>

          {/* Card */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="glass rounded-2xl p-7 sm:p-8"
          >
            <div className="mb-6 text-center">
              <h2 className="text-lg font-medium text-white/90">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="mt-1.5 text-xs text-white/40">
                {mode === 'login' ? 'Sign in to continue your reflection.' : 'Begin your journaling journey.'}
              </p>
            </div>

            {/* Toggle tabs */}
            <div className="flex rounded-xl bg-white/[0.04] p-0.5 mb-6 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 rounded-[10px] px-4 py-2 text-xs font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 rounded-[10px] px-4 py-2 text-xs font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white/80 outline-none transition-all placeholder:text-white/20 focus:border-white/[0.2] focus:bg-white/[0.06]"
                      placeholder="Your name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white/80 outline-none transition-all placeholder:text-white/20 focus:border-white/[0.2] focus:bg-white/[0.06]"
                placeholder="you@example.com"
              />

              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white/80 outline-none transition-all placeholder:text-white/20 focus:border-white/[0.2] focus:bg-white/[0.06]"
                placeholder="At least 6 characters"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400/90 bg-red-500/10 rounded-xl px-3 py-2 border border-red-500/10"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {mode === 'login' ? 'Log in' : 'Create account'}
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 8h9.5m-4-4l4 4-4 4" />
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </motion.div>

          <motion.p variants={fadeUp} custom={4} className="text-center mt-6 text-xs text-white/20">
            Melonote — a calm space for reflection
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

export default Auth;