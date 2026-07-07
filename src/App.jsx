import { useMemo, useState } from 'react'
import a1 from '../data/a1.json'
import b2 from '../data/b2.json'
import c1 from '../data/c1.json'
import c2 from '../data/c2.json'
import WordCard from './WordCard.jsx'
import { useFavorites } from './useFavorites.js'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const WORDS_BY_LEVEL = { A1: a1, B2: b2, C1: c1, C2: c2 }
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

export default function App() {
  const [level, setLevel] = useState('A1')
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const isFavoritesView = level === 'FAVORITES'
  const words = isFavoritesView ? ALL_WORDS : WORDS_BY_LEVEL[level] ?? []

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return words.filter((w) => {
      if (pos === 'etc' ? MAIN_POS.includes(w.pos) : pos !== 'all' && w.pos !== pos) return false
      if ((onlyFavorites || isFavoritesView) && !isFavorite(w.level, w.id)) return false
      if (!q) return true
      return (
        w.french.toLowerCase().includes(q) ||
        w.korean.some((k) => k.includes(q))
      )
    })
  }, [words, query, pos, onlyFavorites, favorites, isFavoritesView])

  return (
    <div className="app">
      <header className="header">
        <h1>🥐 Bienvenue au croissant</h1>
        <p className="tagline">프랑스어 단어장 · FLELex 빈도순</p>
      </header>

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
          className={`level-tab star-tab ${isFavoritesView ? 'active' : ''}`}
          onClick={() => setLevel('FAVORITES')}
          title="모든 레벨의 즐겨찾기"
        >
          ★
        </button>
      </nav>

      <div className="controls">
        <input
          type="search"
          className="search"
          placeholder="프랑스어, 한국어 뜻으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
        </div>
      </div>

      <p className="count">
        {visible.length}개 단어
        {(onlyFavorites || isFavoritesView) && ' (즐겨찾기)'}
      </p>

      <main className="word-list">
        {visible.map((w) => (
          <WordCard
            key={`${w.level}-${w.id}`}
            word={w}
            showLevel={isFavoritesView}
            favorite={isFavorite(w.level, w.id)}
            onToggleFavorite={() => toggleFavorite(w.level, w.id)}
          />
        ))}
        {visible.length === 0 && (
          <p className="empty">조건에 맞는 단어가 없어요.</p>
        )}
      </main>
    </div>
  )
}
