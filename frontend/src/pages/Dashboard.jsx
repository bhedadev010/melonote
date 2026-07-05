import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .catch(() => {
        localStorage.removeItem('melonote-token');
        navigate('/auth', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Journals', value: stats.totalJournals, color: 'bg-sky-50 text-sky-700' },
    { label: 'Journals This Month', value: stats.journalsThisMonth, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Top Emotion', value: stats.mostCommonEmotion, color: 'bg-violet-50 text-violet-700' },
    { label: 'Day Streak', value: `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`, color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-sky-500">Dashboard</p>
        <h1 className="text-3xl font-semibold text-gray-800">Your journaling overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-5 ${card.color}`}>
            <p className="text-xs uppercase tracking-wide opacity-70">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold capitalize">{card.value}</p>
          </div>
        ))}
      </div>

      {stats.emotionDistribution.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Emotion Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.emotionDistribution}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.recentJournals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Recent Journals</h2>
          <div className="space-y-3">
            {stats.recentJournals.map((entry) => (
              <div key={entry._id} className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">{entry.title}</p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{entry.content}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;