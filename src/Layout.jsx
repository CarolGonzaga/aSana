import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Trophy, Heart, MessageCircle, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { MockDataProvider } from './components/data/MockDataContext';

const NAV = [
  { icon: Home,          label: 'Home',      page: 'Home' },
  { icon: BookOpen,      label: 'Estantes',  page: 'Shelves' },
  { icon: Trophy,        label: 'Maratonas', page: 'Marathons' },
  { icon: Heart,         label: 'Match',     page: 'Match' },
  { icon: MessageCircle, label: 'Chat',      page: 'Chat' },
  { icon: Users,         label: 'Amigos',    page: 'Friends' },
  { icon: User,          label: 'Perfil',    page: 'Profile' },
];

export default function Layout({ children, currentPageName }) {
  return (
    <MockDataProvider>
      <div className="min-h-screen" style={{ background: 'var(--bg-main)', paddingBottom: '72px' }}>

        {/* Page content */}
        <main className="w-full max-w-2xl mx-auto px-4 pt-5 pb-2">
          {children}
        </main>

        {/* Fixed bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border)',
            height: '64px',
          }}
        >
          <div className="w-full max-w-2xl mx-auto h-full flex items-center justify-around px-2">
            {NAV.map(({ icon: Icon, label, page }) => {
              const active = currentPageName === page;
              return (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-150"
                  style={{
                    minWidth: 44,
                    padding: '6px 8px',
                    color:      active ? 'var(--accent)' : 'var(--text-muted)',
                    background: active ? 'rgba(193,59,117,0.08)' : 'transparent',
                  }}
                >
                  <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                  <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: 0.2 }}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

      </div>
    </MockDataProvider>
  );
}