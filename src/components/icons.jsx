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
