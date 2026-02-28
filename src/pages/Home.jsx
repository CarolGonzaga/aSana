import React, { useState } from 'react';
import { useMockData } from '../components/data/MockDataContext';
import StatsGrid from '../components/home/StatsGrid';
import BadgesSection from '../components/home/BadgesSection';
import ReadingNow from '../components/home/ReadingNow';
import MonthlyChart from '../components/home/MonthlyChart';
import BigSmallBook from '../components/home/BigSmallBook';
import TopBooks from '../components/home/TopBooks';
import ProgressModal from '../components/shared/ProgressModal';

export default function Home() {
  const { currentUser, getUserBooks, getStats, badges, updateBookProgress } = useMockData();
  const [progressBook, setProgressBook] = useState(null);

  const myBooks    = getUserBooks(currentUser.id);
  const stats      = getStats();
  const readingNow = myBooks.find(b => b.status === 'lendo') || null;

  return (
    <div className="space-y-7 pb-4">

      {/* Page header */}
      <div className="pt-1">
        <p className="text-xs font-medium" style={{ color:'var(--text-muted)' }}>Bem-vinda de volta,</p>
        <h1 className="text-2xl font-bold leading-tight" style={{ color:'var(--text-header)' }}>
          {currentUser.name}
        </h1>
      </div>

      {/* 1. Stats */}
      <StatsGrid stats={stats} />

      {/* 2. Badges */}
      <BadgesSection badges={badges} />

      {/* 3. Lendo agora */}
      <ReadingNow book={readingNow} onUpdateProgress={setProgressBook} />

      {/* 4. Lidos por mês */}
      <MonthlyChart />

      {/* 5. Maior e menor */}
      <BigSmallBook books={myBooks} />

      {/* 6. Top 10 */}
      <TopBooks books={myBooks} />

      {/* Progress modal */}
      <ProgressModal
        open={!!progressBook}
        onClose={() => setProgressBook(null)}
        book={progressBook}
        onSave={updateBookProgress}
      />
    </div>
  );
}