import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
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

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    gradient: 'from-sky-400 to-cyan-300',
    title: 'Journal Freely',
    desc: 'Write without distractions. Your thoughts, your space.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    gradient: 'from-emerald-400 to-teal-300',
    title: 'Spark Ideas',
    desc: 'Get thoughtful prompts to deepen your reflection.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    gradient: 'from-violet-400 to-purple-300',
    title: 'AI Chat',
    desc: 'Chat with an AI that understands your journal history.',
  },
];

function Landing() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('melonote-token'));

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

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-20 right-[10%] w-64 h-64 rounded-full border border-white/[0.04] bg-white/[0.02] backdrop-blur-2xl"
          animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 left-[8%] w-48 h-48 rounded-full border border-white/[0.03] bg-white/[0.01] backdrop-blur-2xl"
          animate={{ y: [0, 10, 0], rotate: [0, -1.5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            AI-powered journaling
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-white/90">Write freely.</span>
            <br />
            <span className="text-gradient">Reflect deeply.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed mb-10"
          >
            A calm space for personal reflection. Write freely, discover insights, and grow with AI that understands you.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/auth')}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-105 active:scale-95"
            >
              <span>Get started</span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 8h9.5m-4-4l4 4-4 4" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-white/[0.2] hover:scale-105 active:scale-95"
            >
              Sign in
            </button>
          </motion.div>

          {/* Decorative AI card */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-16 glass rounded-2xl px-5 py-3.5 flex items-center gap-3 max-w-sm mx-auto"
          >
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 ring-2 ring-[#0a0a0f]" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-300 ring-2 ring-[#0a0a0f]" />
            </div>
            <p className="text-xs text-white/50">
              <span className="text-white/80 font-medium">Spark Idea</span> &mdash; What part of this experience feels most important to you right now?
            </p>
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

      {/* Features Section */}
      <section className="relative px-6 pb-32">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-light text-white/80">
              Everything you need to <span className="text-white">reflect</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={cardVariant}
                custom={i}
                className="group glass glass-hover rounded-2xl p-6 sm:p-8"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white/90 mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeUp} custom={4} className="mt-20 text-center">
            <button
              onClick={() => navigate('/auth')}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-105 active:scale-95"
            >
              Start journaling
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 8h9.5m-4-4l4 4-4 4" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default Landing;