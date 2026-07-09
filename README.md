# bienvenue au croissant 🥐

**[English](#english)** | **[한국어](#한국어)**

---

## English

A French vocabulary web app for Korean speakers. Words are organized by CEFR level (A1–C2) with meanings, example sentences, and pronunciation.

### Features

- **Vocabulary by level**: 4,777 words across A1–C2 (part of speech, gender, meaning, example sentence included)
- **Global search**: search by French word or Korean meaning across all levels at once (accent-insensitive, e.g. `annee` matches `année`)
- **Part-of-speech / learning-status filters**: noun·verb·adjective·adverb·other, unseen/seen
- **Highlighting**: mark words like favorites and view them together
- **Learning progress**: shows completed-word count/percentage per level
- **French pronunciation**: speaker buttons next to words and example sentences play audio via the browser's built-in Web Speech API
- **No login**: all data (highlights, learning progress) is stored only in the browser's `localStorage` — no server or database

### Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- Plain CSS (`src/index.css`), no UI framework
- No state-management library — plain React state only

### Project structure

```
data/                     # word data by level (a1~c2.json)
src/
  App.jsx                  # main screen (search/filters/level tabs/pagination)
  components/
    WordCard.jsx            # word card
    icons.jsx                # icons (highlighter/check/speaker)
  hooks/
    useHighlights.js         # highlight state (localStorage)
    useSeen.js                # learning-progress state (localStorage)
public/
  privacy.html, support.html  # privacy policy / support pages
```

### Data source & license

Word frequency data is based on [FLELex](https://cental.uclouvain.be/cefrlex/flelex/download/) (Pintard & François, 2020), licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — **non-commercial use only**, attribution required. Korean meanings, example sentences, and gender info were newly written with reference to this corpus.

### Related project

The iOS app version is being developed in the [bienvenue-au-croissant-mobile](https://github.com/hyunahparc/bienvenue-au-croissant-mobile) repository (React Native + Expo).

---

## 한국어

한국어 화자를 위한 프랑스어 단어장 웹앱. CEFR 레벨(A1~C2)별로 정리된 단어와 뜻, 예문, 발음을 제공합니다.

### 주요 기능

- **레벨별 단어장**: A1~C2 총 4,777개 단어 (품사, 성별, 뜻, 예문 포함)
- **전체 검색**: 프랑스어 단어 또는 한국어 뜻으로 모든 레벨을 한 번에 검색 (악센트 무시 검색 지원, 예: `annee` → `année`)
- **품사/학습 상태 필터**: 명사·동사·형용사·부사·기타, 안 본 단어/본 단어
- **형광펜 표시**: 즐겨찾기처럼 단어를 표시해두고 모아보기
- **학습 진행률**: 레벨별 학습 완료 개수/퍼센트 표시
- **프랑스어 발음 재생**: 단어와 예문 옆 스피커 버튼으로 브라우저 내장 음성(Web Speech API) 재생
- **로그인 없음**: 모든 데이터(형광펜, 학습 기록)는 브라우저 `localStorage`에만 저장, 서버/DB 없음

### 기술 스택

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- 순수 CSS (`src/index.css`), 별도 UI 프레임워크 없음
- 상태 관리 라이브러리 없이 React state만 사용

### 프로젝트 구조

```
data/                     # 레벨별 단어 데이터 (a1~c2.json)
src/
  App.jsx                  # 메인 화면 (검색/필터/레벨탭/페이지네이션)
  components/
    WordCard.jsx            # 단어 카드
    icons.jsx                # 아이콘 (형광펜/체크/스피커)
  hooks/
    useHighlights.js         # 형광펜 상태 (localStorage)
    useSeen.js                # 학습 완료 상태 (localStorage)
public/
  privacy.html, support.html  # 개인정보처리방침 / 지원 페이지
```

### 데이터 출처 및 라이선스

단어 빈도 데이터는 [FLELex](https://cental.uclouvain.be/cefrlex/flelex/download/) (Pintard & François, 2020)를 참고했으며, [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 라이선스를 따릅니다 — **비영리 목적으로만 사용 가능**하며, 출처를 표시해야 합니다. 한글 뜻·예문·성별 정보 등은 이 코퍼스를 참고해 새로 작성한 것입니다.

### 관련 프로젝트

iOS 앱 버전은 [bienvenue-au-croissant-mobile](https://github.com/hyunahparc/bienvenue-au-croissant-mobile) 저장소에서 개발 중입니다 (React Native + Expo).
