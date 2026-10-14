'use client';
import { useSettings } from '@/hooks/useSettings';
import { FilterType } from '@/types/todo';
import Link from 'next/link';

const FILTERS: FilterType[] = ['all', '진행 중', '완료'];

export default function Navbar() {
  const { theme, filter, handleToggleTheme, handleSetFilter } = useSettings();

  return (
    <nav
      style={{
        padding: '1rem 2rem',
        borderBottom: theme === 'dark' ? '1px solid #444' : '1px solid #ddd',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}
    >
      <strong>TodoFlow</strong>

      {/* 필터 버튼 */}
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => handleSetFilter(f)}
          style={{
            fontWeight: filter === f ? 'bold' : 'normal',
            textDecoration: filter === f ? 'underline' : 'none',
          }}
        >
          {f === 'all' ? '전체' : f}
        </button>
      ))}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
        <Link href="/">목록</Link>
        <Link href="/completed">완료</Link>
        <button onClick={handleToggleTheme} aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
