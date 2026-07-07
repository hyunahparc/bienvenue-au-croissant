const GENDER_LABEL = { m: '남성', f: '여성', mf: '남·여' }

export default function WordCard({ word, favorite, onToggleFavorite, showLevel }) {
  const isNoun = word.pos === 'NOM'
  const genderClass = isNoun ? `gender-${word.gender}` : ''

  return (
    <article className={`card ${genderClass}`}>
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

      <p className="korean">{word.korean.join(' · ')}</p>

      {word.examples.map((ex, i) => (
        <div className="example" key={i}>
          <p className="ex-fr">{ex.fr}</p>
          <p className="ex-ko">{ex.ko}</p>
        </div>
      ))}
    </article>
  )
}
