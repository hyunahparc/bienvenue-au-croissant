import { HighlighterIcon, CheckIcon } from './icons.jsx'

const GENDER_LABEL = { m: '남성', f: '여성', mf: '남·여' }

function highlightWord(text, word) {
  const idx = text.toLowerCase().indexOf(word.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong>{text.slice(idx, idx + word.length)}</strong>
      {text.slice(idx + word.length)}
    </>
  )
}

export default function WordCard({
  word,
  highlighted,
  onToggleHighlight,
  seen,
  onToggleSeen,
  showLevel,
}) {
  const isNoun = word.pos === 'NOM'
  const genderClass = isNoun ? `gender-${word.gender}` : ''

  return (
    <article className={`card ${seen ? 'seen' : ''}`}>
      <div className="card-head">
        {showLevel ? (
          <span className="level-badge">{word.level}</span>
        ) : (
          <span className="rank">#{word.rank}</span>
        )}
        <h2 className="french">
          {isNoun && <span className="article">{word.article}</span>}{' '}
          <span className={`fr-word ${highlighted ? 'marked' : ''}`}>
            {word.french}
          </span>
        </h2>
        <span className="pos-badge">{word.posKo}</span>
        {isNoun && (
          <span className={`gender-badge ${genderClass}`}>
            {GENDER_LABEL[word.gender]}
          </span>
        )}
        <button
          className={`highlighter ${highlighted ? 'on' : ''}`}
          aria-label={highlighted ? '형광펜 지우기' : '형광펜 칠하기'}
          title={highlighted ? '형광펜 지우기' : '형광펜 칠하기'}
          onClick={onToggleHighlight}
        >
          <HighlighterIcon />
        </button>
        <button
          className={`check ${seen ? 'on' : ''}`}
          aria-label={seen ? '학습 표시 해제' : '학습 완료 표시'}
          title={seen ? '학습 표시 해제' : '학습 완료 표시'}
          onClick={onToggleSeen}
        >
          {seen && <CheckIcon />}
        </button>
      </div>

      <div className="korean">
        {word.korean.map((k, i) => (
          <p className="korean-sense" key={i}>{k}</p>
        ))}
      </div>

      {word.examples.map((ex, i) => (
        <div className="example" key={i}>
          <p className="ex-fr">{highlightWord(ex.fr, word.french)}</p>
          <p className="ex-ko">{ex.ko}</p>
        </div>
      ))}
    </article>
  )
}
