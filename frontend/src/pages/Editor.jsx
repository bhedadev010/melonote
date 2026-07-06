import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [blocks, setBlocks] = useState([{ id: 'user-1', role: 'user', content: '' }]);
  const [title, setTitle] = useState('');
  const [focusedBlock, setFocusedBlock] = useState('user-1');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entryId, setEntryId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [toast, setToast] = useState(null);
  const blockRefs = useRef({});
  const token = useMemo(() => localStorage.getItem('melonote-token'), []);
  const isAuthenticated = Boolean(localStorage.getItem('melonote-token'));

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function resizeTextarea(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 36)}px`;
  }

  function focusTextareaAtEnd(el) {
    if (!el) return;
    el.focus();
    el.selectionStart = el.selectionEnd = el.value.length;
  }

  useEffect(() => {
    if (!token) {
      navigate('/auth', { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedEntryId = params.get('entry');

    if (selectedEntryId) {
      setEntryId(selectedEntryId);
      setIsReadOnly(true);
      api.get(`/journal/entries/${selectedEntryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(({ data }) => {
          const entryMessages = data.entry.messages || [];
          const entryBlocks = entryMessages.length > 0
            ? entryMessages.flatMap((message, index) => {
                const role = message.role === 'assistant' ? 'assistant' : 'user';
                const blockId = `${role}-${index + 1}`;
                return [{ id: blockId, role, content: message.content }];
              })
            : [{ id: 'user-1', role: 'user', content: data.entry.fullText || '' }];

          setBlocks(entryBlocks);
          setTitle(data.entry.title || '');
          setFocusedBlock(entryBlocks[entryBlocks.length - 1]?.id || 'user-1');
        })
        .catch(() => {
          showToast('Could not load that entry.', 'error');
        });
      return;
    }

    setIsReadOnly(false);
    const initialRef = blockRefs.current['user-1'];
    if (initialRef) {
      initialRef.focus();
    }
  }, [location.search, navigate, token, showToast]);

  function updateBlock(id, content) {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, content } : block)));
  }

  function handleDeleteBlock(id) {
    const blockIndex = blocks.findIndex((block) => block.id === id);
    const previousBlock = blocks[blockIndex - 1];
    const nextBlock = blocks[blockIndex + 1];

    setBlocks((current) => {
      if (previousBlock?.role === 'user' && nextBlock?.role === 'user') {
        const mergedContent = [previousBlock.content, nextBlock.content]
          .filter((content) => content && content.trim())
          .join('\n\n');

        return current
          .filter((block) => block.id !== id && block.id !== nextBlock.id)
          .map((block) => (block.id === previousBlock.id ? { ...block, content: mergedContent } : block));
      }

      return current.filter((block) => block.id !== id);
    });

    if (previousBlock?.role === 'user') {
      setFocusedBlock(previousBlock.id);
      setTimeout(() => {
        focusTextareaAtEnd(blockRefs.current[previousBlock.id]);
      }, 0);
    }
  }

  function getFocusedUserBlock() {
    const block = blocks.find((item) => item.id === focusedBlock && item.role === 'user');
    if (block) return block;
    return [...blocks].reverse().find((item) => item.role === 'user');
  }

  async function handleSparkIdea() {
    const targetBlock = getFocusedUserBlock();
    if (!targetBlock || !targetBlock.content.trim()) {
      showToast('Write something first to get a spark idea.', 'info');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/journal/spark-idea', { text: targetBlock.content.trim() }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const assistantBlock = { id: `assistant-${Date.now()}`, role: 'assistant', content: data.idea };
      const newUserBlock = { id: `user-${Date.now() + 1}`, role: 'user', content: '' };

      setBlocks((current) => {
        const index = current.findIndex((block) => block.id === targetBlock.id);
        if (index === -1) {
          return [...current, assistantBlock, newUserBlock];
        }

        return [
          ...current.slice(0, index + 1),
          assistantBlock,
          newUserBlock,
          ...current.slice(index + 1),
        ];
      });

      setFocusedBlock(newUserBlock.id);
      setTimeout(() => {
        focusTextareaAtEnd(blockRefs.current[newUserBlock.id]);
      }, 0);
    } catch (error) {
      showToast('Could not generate a spark idea right now.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    const messages = blocks
      .filter((block) => block.role === 'user' || block.role === 'assistant')
      .map((block) => ({ role: block.role === 'assistant' ? 'assistant' : 'user', content: block.content.trim() }))
      .filter((message) => message.content.length > 0);

    const fullText = messages.map((message) => message.content).join('\n\n');

    if (!fullText.trim()) {
      showToast('Please write something before saving.', 'info');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim() || 'Untitled entry',
        fullText: fullText.trim(),
        messages,
      };

      if (entryId) {
        await api.put(`/journal/entries/${entryId}`, payload);
      } else {
        await api.post('/journal/entries', payload);
      }

      localStorage.setItem('melonote-final', JSON.stringify({ messages, fullText }));
      showToast(entryId ? 'Entry updated successfully.' : 'Entry saved successfully.');
      setTimeout(() => navigate('/journal', { replace: true }), 800);
    } catch (error) {
      showToast('Could not save your entry right now.', 'error');
    } finally {
      setSaving(false);
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
          <motion.div variants={fadeUp} custom={0} className="mb-10 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-2">Journal Editor</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                readOnly={isReadOnly}
                className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white/80 outline-none placeholder:text-white/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSparkIdea}
                disabled={loading || isReadOnly}
                className="rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-white/[0.2] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Thinking…' : 'Spark Idea'}
              </button>
              <button
                onClick={handleFinish}
                disabled={saving || isReadOnly}
                className="group rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0a0a0f] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {saving ? 'Saving…' : isReadOnly ? 'Read only' : 'Finish entry'}
                {!saving && !isReadOnly && (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.25 8h9.5m-4-4l4 4-4 4" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          {/* Blocks */}
          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <AnimatePresence>
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className={`relative ${
                    block.role === 'assistant'
                      ? 'glass rounded-2xl p-5 sm:p-6 border-l-2 border-l-sky-400/50'
                      : ''
                  }`}
                >
                  {block.role === 'user' ? (
                    <textarea
                      ref={(node) => {
                        if (node) {
                          blockRefs.current[block.id] = node;
                          resizeTextarea(node);
                        }
                      }}
                      value={block.content}
                      onChange={(event) => {
                        if (isReadOnly) return;
                        updateBlock(block.id, event.target.value);
                        resizeTextarea(event.target);
                      }}
                      onFocus={() => setFocusedBlock(block.id)}
                      placeholder="Start writing here..."
                      spellCheck
                      rows={1}
                      readOnly={isReadOnly}
                      className="w-full resize-none bg-transparent text-lg sm:text-xl leading-8 text-white/80 outline-none placeholder:text-white/20 transition-all duration-200"
                    />
                  ) : (
                    <div className="text-lg sm:text-xl leading-8 text-white/70">
                      {block.content}
                    </div>
                  )}

                  {block.role === 'assistant' && !isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id)}
                      aria-label="Delete generated question"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 opacity-0 transition-all hover:bg-white/10 hover:text-white/80 hover:scale-110 group-hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0h10l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L6 7z" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
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

export default Editor;