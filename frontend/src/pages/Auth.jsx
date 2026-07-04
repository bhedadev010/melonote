import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Auth() {
  const navigate = useNavigate();
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
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === 'login' ? 'Sign in to continue your reflection.' : 'Create an account to begin journaling.'}
          </p>
        </div>

        <div className="flex rounded-full bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === 'login' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === 'register' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 text-white py-3 font-medium hover:bg-sky-600 disabled:opacity-70"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
