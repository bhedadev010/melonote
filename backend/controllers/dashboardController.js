const JournalEntry = require('../models/JournalEntry');

async function getStats(req, res) {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalJournals, journalsThisMonth, allEntries] = await Promise.all([
      JournalEntry.countDocuments({ user: userId }),
      JournalEntry.countDocuments({ user: userId, createdAt: { $gte: startOfMonth } }),
      JournalEntry.find({ user: userId })
        .select('emotions createdAt fullText title')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Emotion distribution
    const emotionCounts = {};
    for (const entry of allEntries) {
      if (entry.emotions && entry.emotions.length > 0) {
        const topEmotion = entry.emotions[0];
        const label = topEmotion.label;
        emotionCounts[label] = (emotionCounts[label] || 0) + 1;
      }
    }

    const emotionDistribution = Object.entries(emotionCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const mostCommonEmotion = emotionDistribution.length > 0 ? emotionDistribution[0].label : 'None';

    // Writing streak
    const dates = allEntries
      .map((entry) => {
        const d = new Date(entry.createdAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()
      .reverse();

    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (dates[i] === dateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Recent 5 journals
    const recentJournals = allEntries.slice(0, 5).map((entry) => ({
      _id: entry._id,
      title: entry.title || 'Untitled entry',
      fullText: (entry.fullText || '').slice(0, 150),
      createdAt: entry.createdAt,
    }));

    return res.json({
      totalJournals,
      journalsThisMonth,
      mostCommonEmotion,
      emotionDistribution,
      streak,
      recentJournals,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
}

module.exports = {
  getStats,
};