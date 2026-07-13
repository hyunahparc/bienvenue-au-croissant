// data/conjugations.json(638KB)은 동사 카드를 펼칠 때만 필요하므로
// 앱 첫 로딩에 포함되지 않게 동적 import로 지연 로드하고, 한 번 받아오면 재사용한다.
let promise = null

export function getConjugations() {
  if (!promise) {
    promise = import('../data/conjugations.json').then((m) => m.default)
  }
  return promise
}
