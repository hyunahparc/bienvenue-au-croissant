// data/*.json의 동사(pos === 'VER')를 모아 Lefff에서 활용형을 조회해
// data/conjugations.json을 생성한다. 단어 추가 후 재실행: node scripts/generate-conjugations.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { alwaysAuxEtre } from 'french-verbs'
import lefff from 'french-verbs-lefff/dist/conjugations.json' with { type: 'json' }

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

const verbs = new Set()
for (const level of LEVELS) {
  const words = JSON.parse(readFileSync(`data/${level}.json`, 'utf8'))
  for (const w of words) {
    if (w.pos === 'VER') verbs.add(w.french)
  }
}

// Lefff는 œ 합자를 oe로 표기한다(예: œuvrer는 'oeuvrer'로 등재). 우리 데이터의
// œ 표제어를 놓치지 않도록, 정확한 키가 없으면 œ→oe로 바꿔 조회하고 반환된
// 활용형은 다시 oe→œ로 되돌린다(해당 단어의 oe는 전부 œ에서 온 것이라 안전).
function lookup(verb) {
  if (lefff[verb]) return lefff[verb]
  if (!verb.includes('œ')) return null
  const raw = lefff[verb.replace(/œ/g, 'oe')]
  if (!raw) return null
  const restore = (arr) => arr?.map((f) => (typeof f === 'string' ? f.replace(/oe/g, 'œ') : f))
  const fixed = {}
  for (const key of Object.keys(raw)) fixed[key] = restore(raw[key])
  return fixed
}

const conjugations = {}
let missing = 0
for (const verb of verbs) {
  const info = lookup(verb)
  if (!info) {
    missing++
    continue
  }
  conjugations[verb] = {
    aux: alwaysAuxEtre(verb) ? 'être' : 'avoir',
    pp: info.K?.[0] ?? null,
    present: info.P ?? null,
    imparfait: info.I ?? null,
    futur: info.F ?? null,
    conditionnel: info.C ?? null,
    subjonctif: info.S ?? null,
  }
}

writeFileSync('data/conjugations.json', JSON.stringify(conjugations))

console.log(`동사 ${verbs.size}개 중 ${Object.keys(conjugations).length}개 생성, ${missing}개 누락 (Lefff 미수록)`)
