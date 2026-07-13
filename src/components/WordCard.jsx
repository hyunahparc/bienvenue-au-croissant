import { useEffect, useState } from 'react'
import { HighlighterIcon, CheckIcon, SpeakerIcon } from './icons.jsx'
import { getConjugations } from '../conjugations.js'

const GENDER_LABEL = { m: '남성', f: '여성', mf: '남·여' }

const PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']

const DISPLAY_ORDER = [0, 4, 1, 3, 2, 5]

const VOWEL_START = /^[aeiouhâàéèêëîïôùûü]/i

function longestCommonPrefix(forms) {
  const valid = forms.filter((f) => f != null)
  if (valid.length === 0) return ''
  let prefix = valid[0]
  for (const f of valid.slice(1)) {
    while (prefix && !f.startsWith(prefix)) prefix = prefix.slice(0, -1)
    if (!prefix) break
  }
  return prefix
}

function pronounPrefix(i, form) {
  if (i === 0) return VOWEL_START.test(form) ? "j'" : 'je '
  return `${PRONOUNS[i]} `
}

function quePrefix(i, form) {
  if (i === 0) return `que ${VOWEL_START.test(form) ? "j'" : 'je '}`
  if (i === 2 || i === 5) return `qu'${PRONOUNS[i]} `
  return `que ${PRONOUNS[i]} `
}

function buildRows(forms, prefixFn) {
  if (!forms) return null
  const stem = longestCommonPrefix(forms)
  return forms.map((f, i) => {
    if (f == null) return null
    return { prefix: prefixFn(i, f), plain: f.slice(0, stem.length), bold: f.slice(stem.length), after: '' }
  })
}

const AUX_ONLY = {
  avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
  être: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
}

function buildPasseComposeRows(conj) {
  if (!conj.pp) return null
  return AUX_ONLY[conj.aux].map((aux, i) => ({
    prefix: pronounPrefix(i, aux),
    plain: '',
    bold: aux,
    after: ` ${conj.pp}`,
  }))
}

const TENSE_DEFS = [
  { key: 'present', label: '현재', build: (c) => buildRows(c.present, pronounPrefix) },
  { key: 'passeCompose', label: '복합과거', build: buildPasseComposeRows },
  { key: 'imparfait', label: '반과거', build: (c) => buildRows(c.imparfait, pronounPrefix) },
  { key: 'futur', label: '미래', build: (c) => buildRows(c.futur, pronounPrefix) },
  { key: 'conditionnel', label: '조건법', build: (c) => buildRows(c.conditionnel, pronounPrefix) },
  { key: 'subjonctif', label: '접속법', build: (c) => buildRows(c.subjonctif, quePrefix) },
]

let currentUtterance = null

function speak(text) {
  const synth = window.speechSynthesis
  if (!synth) return

  const voices = synth.getVoices()
  const frVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'))
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
    setTimeout(() => synth.speak(utterance), 50)
  } else {
    synth.speak(utterance)
  }
}

function collectVerbForms(conj) {
  const forms = new Set()
  for (const key of ['present', 'imparfait', 'futur', 'conditionnel', 'subjonctif']) {
    for (const f of conj[key] ?? []) {
      if (f) forms.add(f)
    }
  }
  if (conj.pp) forms.add(conj.pp)
  return [...forms]
}

const LETTER = /[a-zà-ÿœæ]/i

function findMatch(text, candidates) {
  const lower = text.toLowerCase()
  const sorted = [...candidates].sort((a, b) => b.length - a.length)
  for (const candidate of sorted) {
    const needle = candidate.toLowerCase()
    let start = 0
    for (;;) {
      const idx = lower.indexOf(needle, start)
      if (idx === -1) break
      const before = idx > 0 ? text[idx - 1] : ''
      const after = idx + needle.length < text.length ? text[idx + needle.length] : ''
      if (!LETTER.test(before) && !LETTER.test(after)) {
        return { index: idx, length: candidate.length }
      }
      start = idx + 1
    }
  }
  return null
}

function highlightWord(text, candidates) {
  const match = findMatch(text, candidates)
  if (!match) return text
  const { index, length } = match
  return (
    <>
      {text.slice(0, index)}
      <strong>{text.slice(index, index + length)}</strong>
      {text.slice(index + length)}
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
  const isVerb = word.pos === 'VER'
  const genderClass = isNoun ? `gender-${word.gender}` : ''

  const [conjugations, setConjugations] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!isVerb) return
    let cancelled = false
    getConjugations().then((data) => {
      if (!cancelled) setConjugations(data)
    })
    return () => {
      cancelled = true
    }
  }, [isVerb])

  const conj = isVerb ? conjugations?.[word.french] : null

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
            {highlightWord(ex.fr, conj ? [...collectVerbForms(conj), word.french] : [word.french])}
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

      {conj && (
        <div className="conjugation">
          <button
            className="conjugation-toggle"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? '▲' : '▼'}
          </button>
          {expanded && (
            <div className="conjugation-body">
              {TENSE_DEFS.map(({ key, label, build }) => {
                const rows = build(conj)
                if (!rows) return null
                return (
                  <div className="tense-block" key={key}>
                    <h4 className="tense-label">{label}</h4>
                    <div className="tense-forms">
                      {DISPLAY_ORDER.map((i) => {
                        const r = rows[i]
                        return (
                          r && (
                            <span className="conj-form" key={i}>
                              {r.prefix}
                              {r.plain}
                              <strong>{r.bold}</strong>
                              {r.after}
                            </span>
                          )
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
