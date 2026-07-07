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

export default function WordCard({ word, favorite, onToggleFavorite, showLevel }) {
  const isNoun = word.pos === 'NOM'
  const genderClass = isNoun ? `gender-${word.gender}` : ''

  return (
    <article className="card">
      <div className="card-head">
        {showLevel ? (
          <span className="level-badge">{word.level}</span>
        ) : (
          <span className="rank">#{word.rank}</span>
        )}
        <h2 className="french">
          {isNoun && <span className="article">{word.article}</span>} {word.french}
        </h2>
        <span className="pos-badge">{word.posKo}</span>
        {isNoun && (
          <span className={`gender-badge ${genderClass}`}>
            {GENDER_LABEL[word.gender]}
          </span>
        )}
        <button
          className={`star ${favorite ? 'on' : ''}`}
          aria-label={favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          onClick={onToggleFavorite}
        >
          {favorite ? '★' : '☆'}
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
