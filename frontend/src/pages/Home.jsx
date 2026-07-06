import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(localStorage.getItem('melonote-token'));

  useEffect(() => {
    const token = localStorage.getItem('melonote-token');
    if (!token) {
      navigate('/auth', { replace: true });
      return;
    }

    api.get('/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => setStats(data))
      .catch(() => navigate('/auth', { replace: true }))
      .finally(() => setLoading(false));
  }, [navigate]);

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
          <span className="text-2xl font-semibold text-gradient tracking-tight">Melonote</span>
        </div>

        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm space-y-4">
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse mx-auto" />
            <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
            <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Journals', value: stats.totalJournals, gradient: 'from-sky-400 to-cyan-300' },
    { label: 'Journals This Month', value: stats.journalsThisMonth, gradient: 'from-emerald-400 to-teal-300' },
    { label: 'Top Emotion', value: stats.mostCommonEmotion, gradient: 'from-violet-400 to-purple-300' },
    { label: 'Day Streak', value: `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`, gradient: 'from-amber-400 to-orange-300' },
  ];

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
          className="text-2xl font-semibold text-gradient tracking-tight transition-opacity hover:opacity-80"
        >
          Melonote
        </button>
      </div>

      {/* Top-right user menu */}
      <div className="fixed top-6 right-6 z-50">
        <div className="relative group">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white/90 hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.25h15.002c.966 0 1.75-.784 1.75-1.75v-7.5c0-.966-.784-1.75-1.75-1.75H4.501c-.966 0-1.75.784-1.75 1.75v7.5c0 .966.784 1.75 1.75 1.75z" />
            </svg>
          </button>
          <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
            <div className="p-3 border-b border-white/10">
              <p className="text-sm font-medium text-white/90">Account</p>
              <p className="text-xs text-white/40 mt-0.5">Manage your account</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('melonote-token');
                localStorage.removeItem('melonote-user');
                navigate('/auth', { replace: true });
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white/90 transition-all rounded-b-2xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-light text-white/80 mb-3">
              Welcome back
            </h1>
            <p className="text-base text-white/40">
              Ready to reflect?
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="space-y-3 w-full max-w-sm">
            <button
              onClick={() => navigate('/editor')}
              className="group w-full rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span>New Journal Entry</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 8h9.5m-4-4l4 4-4 4" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/journal')}
              className="group w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-6 py-4 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-white/[0.2] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>View Past Journals</span>
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="group w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-6 py-4 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-white/[0.2] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 013 21V12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span>Chat with AI</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border border-white/[0.1] flex items-start justify-center pt-1.5"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-white/30"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Section */}
      <section className="relative px-6 pb-32">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-4">Overview</p>
            <h2 className="text-3xl sm:text-4xl font-light text-white/80">
              Your <span className="text-white">journaling</span> journey
            </h2>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                variants={cardVariant}
                custom={i}
                className="glass glass-hover rounded-2xl p-5 sm:p-6"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 text-white shadow-lg`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-11.25zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <p className="text-xs text-white/40 mb-1">{card.label}</p>
                <p className="text-xl font-semibold text-white/90 capitalize">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Emotion Distribution Chart */}
          {stats.emotionDistribution.length > 0 && (
            <motion.div
              variants={fadeUp}
              custom={4}
              className="glass rounded-2xl p-6 sm:p-8 mb-8"
            >
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-6">Emotion Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.emotionDistribution}>
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: 'rgba(10,10,15,0.9)',
                      color: 'rgba(255,255,255,0.8)'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

        </motion.div>
      </section>
    </>
  );
}

export default Home;