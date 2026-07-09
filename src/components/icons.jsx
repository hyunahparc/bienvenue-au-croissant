export function HighlighterIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <g transform="rotate(-45 12 12)">
        <rect x="8.5" y="2" width="7" height="4" rx="0.8" fill="currentColor" opacity="0.55" />
        <rect x="8.5" y="6" width="7" height="11" fill="currentColor" />
        <polygon points="8.5,17 15.5,17 13,22 11,22" fill="currentColor" />
      </g>
    </svg>
  )
}

export function SpeakerIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M4 9 V15 H8 L13 19.5 V4.5 L8 9 Z" fill="currentColor" />
      <path
        d="M16 8.5 C17.5 9.8 17.5 14.2 16 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.5 6 C21 8.2 21 15.8 18.5 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        d="M5 12.5 L10 17 L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
