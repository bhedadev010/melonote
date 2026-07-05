import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm animate-fade-in">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-wide text-sky-500">Chat</p>
          <h1 className="text-3xl font-semibold text-gray-800">Ask me about your journals</h1>
          <p className="text-sm text-gray-500 mt-2">I can help you reflect on your past entries.</p>
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4 h-96 overflow-y-auto chat-scroll">
          <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: '0.1s' }}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-sky-500 text-white rounded-br-md animate-slide-in-right'
                      : 'bg-gray-200 text-gray-800 rounded-bl-md animate-slide-in-left'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          {loading && (
            <div className="flex justify-start mt-4 animate-fade-in">
              <div className="bg-gray-200 rounded-2xl px-4 py-3 text-sm flex items-center gap-1.5">
                <span className="typing-dot w-1.5 h-1.5 bg-gray-500 rounded-full inline-block" />
                <span className="typing-dot w-1.5 h-1.5 bg-gray-500 rounded-full inline-block" />
                <span className="typing-dot w-1.5 h-1.5 bg-gray-500 rounded-full inline-block" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your journals... (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none transition-all focus:border-sky-300 focus:ring-1 focus:ring-sky-200 resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-sky-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 self-end"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;