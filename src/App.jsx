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
import { HighlighterIcon, CheckIcon } from './components/icons.jsx'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const WORDS_BY_LEVEL = { A1: a1, A2: a2, B1: b1, B2: b2, C1: c1, C2: c2 }
const ALL_WORDS = Object.values(WORDS_BY_LEVEL).flat()

const POS_FILTERS = [
  { key: 'NOM', label: '명사' },
  { key: 'VER', label: '동사' },
  { key: 'ADJ', label: '형용사' },
  { key: 'ADV', label: '부사' },
  { key: 'etc', label: '기타' },
]
const MAIN_POS = ['NOM', 'VER', 'ADJ', 'ADV']
const PAGE_SIZE = 30

const stripAccents = (str) =>
  str.normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function App() {
  const [level, setLevel] = useState('A1')
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState('all')
  const [seenFilter, setSeenFilter] = useState('all')
  const [showPosFilters, setShowPosFilters] = useState(false)
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
      if (!isHighlightsView && seenFilter === 'unseen' && isSeen(w.level, w.id)) return false
      if (!isHighlightsView && seenFilter === 'seen' && !isSeen(w.level, w.id)) return false
      if (!q) return true
      // 한글이 포함된 검색어는 뜻(한국어)에서만, 그 외는 프랑스어 단어에서만 찾는다
      // (예문은 검색 대상에서 제외)
      return /[ㄱ-힝]/.test(q)
        ? w.korean.some((k) => k.toLowerCase().includes(q))
        : stripAccents(w.french.toLowerCase()).includes(stripAccents(q))
    })
  }, [searchScope, trimmedQuery, pos, highlights, isHighlightsView, seenFilter, seen])

  const seenCount = useMemo(
    () => levelWords.filter((w) => isSeen(w.level, w.id)).length,
    [levelWords, seen]
  )
  const progressPercent =
    levelWords.length > 0 ? Math.round((seenCount / levelWords.length) * 100) : 0

  useEffect(() => {
    setPage(1)
  }, [level, query, pos, seenFilter])

  useEffect(() => {
    if (isSearching) {
      setPos('all')
      setSeenFilter('all')
      setShowPosFilters(false)
      setLevel('A1')
    }
  }, [isSearching])

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
          <img src="/logo-brown.png" alt="" className="logo" />
          <button
            type="button"
            className="title-btn"
            onClick={() => window.location.reload()}
            aria-label="새로고침"
            title="새로고침"
          >
            <span className="title-text">bienvenue au croissant</span>
          </button>
          <img src="/logo-brown.png" alt="" className="logo" />
        </h1>
      </header>

      <input
        type="search"
        className="search search-global"
        placeholder="단어 또는 뜻으로 검색하기 (모든 레벨)"
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
        {!isSearching && (
          <>
            <p className="count">
              {visible.length}개 단어
              {isHighlightsView && ' (형광펜)'}
              {!isHighlightsView && levelWords.length > 0 &&
                ` · ${seenCount}/${levelWords.length} 학습 (${progressPercent}%)`}
              {totalPages > 1 && ` · ${currentPage}/${totalPages} 페이지`}
            </p>

            {!isHighlightsView && levelWords.length > 0 && (
              <div className="progress-bar" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            )}
          </>
        )}

        <div className="chips">
          <button
            className={`chip ${pos === 'all' ? 'active' : ''}`}
            onClick={() => setPos('all')}
          >
            전체
          </button>
          {!isHighlightsView && (
            <button
              className={`chip unseen-chip ${seenFilter === 'unseen' ? 'active' : ''}`}
              onClick={() => setSeenFilter((v) => (v === 'unseen' ? 'all' : 'unseen'))}
              aria-label="안 본 단어만 보기"
              title="안 본 단어만 보기"
            >
              <span className="chip-checkbox" aria-hidden="true" />
            </button>
          )}
          {!isHighlightsView && (
            <button
              className={`chip unseen-chip ${seenFilter === 'seen' ? 'active' : ''}`}
              onClick={() => setSeenFilter((v) => (v === 'seen' ? 'all' : 'seen'))}
              aria-label="본 단어만 보기"
              title="본 단어만 보기"
            >
              <span className="chip-checkbox checked" aria-hidden="true">
                <CheckIcon />
              </span>
            </button>
          )}
          <button
            className={`chip pos-toggle ${pos !== 'all' ? 'active' : ''}`}
            onClick={() => setShowPosFilters((v) => !v)}
          >
            필터 {showPosFilters ? '▲' : '▼'}
          </button>
        </div>

        {showPosFilters && (
          <div className="chips pos-filters">
            {POS_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`chip ${pos === f.key ? 'active' : ''}`}
                onClick={() => setPos(f.key)}
              >
                {f.label}
              </button>
            ))}
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

      <footer className="footer">
        <p>© {new Date().getFullYear()} bienvenue au croissant. All rights reserved.</p>
        <p>
          Word frequency data: <a href="https://cental.uclouvain.be/cefrlex/flelex/download/" target="_blank" rel="noopener noreferrer">FLELex</a>
          {' '}(Pintard, A. &amp; François, T. 2020) ·{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>
        </p>
      </footer>
    </div>
  )
}
