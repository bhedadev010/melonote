import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Editor() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([{ id: 'user-1', role: 'user', content: '' }]);
  const [focusedBlock, setFocusedBlock] = useState('user-1');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const blockRefs = useRef({});
  const token = useMemo(() => localStorage.getItem('melonote-token'), []);

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
    const initialRef = blockRefs.current['user-1'];
    if (initialRef) {
      initialRef.focus();
    }
  }, []);

  function updateBlock(id, content) {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, content } : block)));
  }

  function getFocusedUserBlock() {
    const block = blocks.find((item) => item.id === focusedBlock && item.role === 'user');
    if (block) return block;
    return [...blocks].reverse().find((item) => item.role === 'user');
  }

  async function handleSparkIdea() {
    const targetBlock = getFocusedUserBlock();
    if (!targetBlock || !targetBlock.content.trim()) {
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    const messages = blocks
      .filter((block) => block.role === 'user' || block.role === 'assistant')
      .map((block) => ({ role: block.role === 'assistant' ? 'assistant' : 'user', content: block.content.trim() }))
      .filter((message) => message.content.length > 0);

    const fullText = messages.map((message) => message.content).join('\n\n');

    localStorage.setItem('melonote-final', JSON.stringify({ messages, fullText }));
    window.alert('Entry collected. Ready for the next step.');
  }

  return (
    <div className="min-h-screen bg-white px-8 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Journal Editor</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-900">Write like you’re on a blank page.</h1>
          </div>
          <button
            onClick={handleFinish}
            disabled={saving}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            Finish entry
          </button>
        </div>

        <div className="space-y-6">
              {blocks.map((block) => (
            <div key={block.id} className={block.role === 'assistant' ? 'rounded-2xl bg-slate-50 px-3 py-2 text-slate-700 shadow-sm transition-all duration-300 max-w-3xl' : ''}>
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
                    updateBlock(block.id, event.target.value);
                    resizeTextarea(event.target);
                  }}
                  onFocus={() => setFocusedBlock(block.id)}
                  placeholder="Start writing here..."
                  spellCheck
                  rows={1}
                  className="w-full resize-none bg-transparent text-xl leading-8 text-slate-900 outline-none placeholder:text-slate-400"
                />
              ) : (
                <div className="rounded-2xl bg-slate-50 px-1.5 py-0.5 text-xl leading-8 text-slate-800">
                  {block.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={handleSparkIdea}
            disabled={loading}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Thinking…' : 'Spark Idea'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
