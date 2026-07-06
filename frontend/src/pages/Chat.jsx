import { useEffect, useRef, useState } from 'react';
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

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isAuthenticated = Boolean(localStorage.getItem('melonote-token'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const token = localStorage.getItem('melonote-token');
    if (!token) {
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  async function handleSendMessage(event) {
    event.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages((current) => [...current, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const token = localStorage.getItem('melonote-token');
      const { data } = await api.post('/journal/chat', { question: inputValue.trim() }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const assistantMessage = { role: 'assistant', content: data.answer };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((current) => [...current, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
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
          className="mx-auto max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Header */}
          <motion.div variants={fadeUp} custom={0} className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-2">Chat</p>
            <h1 className="text-3xl sm:text-4xl font-light text-white/80 mb-2">Ask me about your journals</h1>
            <p className="text-sm text-white/40">I can help you reflect on your past entries.</p>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            {/* Messages */}
            <div className="mb-6 rounded-2xl bg-white/[0.02] p-4 h-[500px] overflow-y-auto chat-scroll">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-white/10 text-white/90 rounded-br-md'
                          : 'glass rounded-bl-md border-l-2 border-l-sky-400/50 text-white/70'
                      }`}>
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {loading && (
                <div className="flex justify-start mt-4">
                  <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    <span className="typing-dot w-1.5 h-1.5 bg-white/50 rounded-full inline-block animate-pulse" />
                    <span className="typing-dot w-1.5 h-1.5 bg-white/50 rounded-full inline-block animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="typing-dot w-1.5 h-1.5 bg-white/50 rounded-full inline-block animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your journals... (Enter to send, Shift+Enter for new line)"
                rows={2}
                className="flex-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white/80 outline-none transition-all placeholder:text-white/20 focus:border-white/[0.2] focus:bg-white/[0.06] resize-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="group rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 self-end flex items-center gap-2"
              >
                {loading ? 'Sending…' : 'Send'}
                {!loading && (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 8h9.5m-4-4l4 4-4 4" />
                  </svg>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Chat;