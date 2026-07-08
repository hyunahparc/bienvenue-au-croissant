import { useEffect, useMemo, useState } from 'react'
import a1 from '../data/a1.json'
import a2 from '../data/a2.json'
import b1 from '../data/b1.json'
import b2 from '../data/b2.json'
import c1 from '../data/c1.json'
import c2 from '../data/c2.json'
import WordCard from './components/WordCard.jsx'
import { useHighlights } from './hooks/useHighlights.js'
import { useSeen } from './hooks/useSeen.js'
import { HighlighterIcon } from './components/icons.jsx'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const WORDS_BY_LEVEL = { A1: a1, A2: a2, B1: b1, B2: b2, C1: c1, C2: c2 }
const ALL_WORDS = Object.values(WORDS_BY_LEVEL).flat()

const POS_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'NOM', label: '명사' },
  { key: 'VER', label: '동사' },
  { key: 'ADJ', label: '형용사' },
  { key: 'ADV', label: '부사' },
  { key: 'etc', label: '기타' },
]
const MAIN_POS = ['NOM', 'VER', 'ADJ', 'ADV']
const PAGE_SIZE = 30

export default function App() {
  const [level, setLevel] = useState('A1')
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState('all')
  const [onlyUnseen, setOnlyUnseen] = useState(false)
  const [page, setPage] = useState(1)
  const { highlights, toggleHighlight, isHighlighted } = useHighlights()
  const { seen, toggleSeen, isSeen } = useSeen()

  const isHighlightsView = level === 'HIGHLIGHTS'
  const trimmedQuery = query.trim()
  const isSearching = trimmedQuery.length > 0
  const levelWords = WORDS_BY_LEVEL[level] ?? []
  const searchScope = isHighlightsView || isSearching ? ALL_WORDS : levelWords
  const showLevelBadge = isHighlightsView || isSearching

  const visible = useMemo(() => {
    const q = trimmedQuery.toLowerCase()
    return searchScope.filter((w) => {
      if (pos === 'etc' ? MAIN_POS.includes(w.pos) : pos !== 'all' && w.pos !== pos) return false
      if (isHighlightsView && !isHighlighted(w.level, w.id)) return false
      if (!isHighlightsView && onlyUnseen && isSeen(w.level, w.id)) return false
      if (!q) return true
      return (
        w.french.toLowerCase().includes(q) ||
        w.korean.some((k) => k.includes(q))
      )
    })
  }, [searchScope, trimmedQuery, pos, highlights, isHighlightsView, onlyUnseen, seen])

  const seenCount = useMemo(
    () => levelWords.filter((w) => isSeen(w.level, w.id)).length,
    [levelWords, seen]
  )
  const progressPercent =
    levelWords.length > 0 ? Math.round((seenCount / levelWords.length) * 100) : 0

  useEffect(() => {
    setPage(1)
  }, [level, query, pos, onlyUnseen])

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const goToPage = (p) => {
    setPage(Math.min(Math.max(1, p), totalPages))
    // 리스트가 새 페이지 내용으로 다시 그려진 뒤에 스크롤해야
    // 모바일에서 문서 높이 변화로 smooth 스크롤이 끊기지 않는다
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          <img src="/logo_brown.png" alt="" className="logo" />
          <span className="title-text">bienvenue au croissant</span>
          <img src="/logo_brown.png" alt="" className="logo" />
        </h1>
      </header>

      <input
        type="search"
        className="search search-global"
        placeholder="단어 또는 뜻으로 검색하기"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <nav className="levels">
        {LEVELS.map((lv) => {
          const has = lv in WORDS_BY_LEVEL
          return (
            <button
              key={lv}
              className={`level-tab ${level === lv ? 'active' : ''}`}
              disabled={!has}
              title={has ? undefined : '준비 중'}
              onClick={() => setLevel(lv)}
            >
              {lv}
            </button>
          )
        })}
        <button
          className={`level-tab highlight-tab ${isHighlightsView ? 'active' : ''}`}
          onClick={() => setLevel('HIGHLIGHTS')}
          title="모든 레벨의 형광펜 단어"
        >
          <HighlighterIcon />
        </button>
      </nav>

      <div className="folder">
        <div className="chips">
          {POS_FILTERS.map((f) => (
            <button
              key={f.key}
              className={`chip ${pos === f.key ? 'active' : ''}`}
              onClick={() => setPos(f.key)}
            >
              {f.label}
            </button>
          ))}
          {!isHighlightsView && (
            <button
              className={`chip unseen-chip ${onlyUnseen ? 'active' : ''}`}
              onClick={() => setOnlyUnseen((v) => !v)}
            >
              안 본 단어
            </button>
          )}
        </div>

        <p className="count">
          {visible.length}개 단어
          {isHighlightsView && ' (형광펜)'}
          {isSearching && !isHighlightsView && ' (전체 검색)'}
          {!isHighlightsView && levelWords.length > 0 &&
            ` · ${seenCount}/${levelWords.length} 학습 (${progressPercent}%)`}
          {totalPages > 1 && ` · ${currentPage}/${totalPages} 페이지`}
        </p>

        {!isHighlightsView && levelWords.length > 0 && (
          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        <main className="word-list">
          {paginated.map((w) => (
            <WordCard
              key={`${w.level}-${w.id}`}
              word={w}
              showLevel={showLevelBadge}
              highlighted={isHighlighted(w.level, w.id)}
              onToggleHighlight={() => toggleHighlight(w.level, w.id)}
              seen={isSeen(w.level, w.id)}
              onToggleSeen={() => toggleSeen(w.level, w.id)}
            />
          ))}
          {visible.length === 0 && (
            <p className="empty">조건에 맞는 단어가 없어요.</p>
          )}
        </main>

        {totalPages > 1 && (
          <nav className="pager">
            <button
              className="pager-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              ← 이전
            </button>
            <span className="pager-status">{currentPage} / {totalPages}</span>
            <button
              className="pager-btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              다음 →
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
