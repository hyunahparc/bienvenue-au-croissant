import { HighlighterIcon, CheckIcon, SpeakerIcon } from './icons.jsx'

const GENDER_LABEL = { m: '남성', f: '여성', mf: '남·여' }

// 모듈 스코프에 잡아둬야 함: 로컬 변수로만 두면 크롬이 발화 전에
// utterance를 가비지 컬렉션해버려서 소리가 안 나는 경우가 있다.
let currentUtterance = null

function speak(text) {
  const synth = window.speechSynthesis
  if (!synth) return

  const voices = synth.getVoices()
  const frVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'))
  // 크롬은 lang만 지정하면 "Google français" 같은 원격(네트워크) 음성을
  // 고르는 경우가 있는데, 그 요청이 조용히 실패하면 이벤트는 정상 발생하면서
  // 소리만 안 난다. localService(기기 내장) 음성을 우선으로 명시 지정한다.
  // macOS 표준 남성 음성(Thomas/Daniel/Jacques)을 우선으로 고른다.
  const MALE_VOICE_NAMES = ['Thomas', 'Daniel', 'Jacques']
  const localFrVoices = frVoices.filter((v) => v.localService)
  const bestVoice =
    MALE_VOICE_NAMES.map((name) => localFrVoices.find((v) => v.name === name)).find(Boolean) ??
    localFrVoices[0] ??
    frVoices[0] ??
    null

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  if (bestVoice) utterance.voice = bestVoice
  currentUtterance = utterance

  if (synth.speaking || synth.pending) {
    synth.cancel()
    // cancel() 직후 곧바로 speak()를 부르면 크롬에서 무시되는 경우가 있어
    // 다음 tick으로 미룬다.
    setTimeout(() => synth.speak(utterance), 50)
  } else {
    synth.speak(utterance)
  }
}

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
      <div className="title-row">
        <h2 className="french">
          {isNoun && <span className="article">{word.article}</span>}{' '}
          <span className={`fr-word ${highlighted ? 'marked' : ''}`}>
            {word.french}
          </span>
        </h2>
        <button
          className="speaker"
          aria-label="발음 듣기"
          title="발음 듣기"
          onClick={() => speak(word.french)}
        >
          <SpeakerIcon />
        </button>
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

      <div className="card-head">
        {showLevel && <span className="level-badge">{word.level}</span>}
        <span className="pos-badge">{word.posKo}</span>
        {isNoun && (
          <span className={`gender-badge ${genderClass}`}>
            {GENDER_LABEL[word.gender]}
          </span>
        )}
      </div>

      {word.examples.map((ex, i) => (
        <div className="example" key={i}>
          <p className="ex-fr">
            {highlightWord(ex.fr, word.french)}
            <button
              className="ex-speaker"
              aria-label="예문 발음 듣기"
              title="예문 발음 듣기"
              onClick={() => speak(ex.fr)}
            >
              <SpeakerIcon />
            </button>
          </p>
          <p className="ex-ko">{ex.ko}</p>
        </div>
      ))}
    </article>
  )
}
