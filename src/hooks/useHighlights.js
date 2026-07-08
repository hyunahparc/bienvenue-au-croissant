import { useState } from 'react'

const STORAGE_KEY = 'croissant.highlights.v1'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function useHighlights() {
  const [highlights, setHighlights] = useState(load)

  const toggleHighlight = (level, id) => {
    setHighlights((prev) => {
      const next = new Set(prev)
      const key = `${level}:${id}`
      next.has(key) ? next.delete(key) : next.add(key)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const isHighlighted = (level, id) => highlights.has(`${level}:${id}`)

  return { highlights, toggleHighlight, isHighlighted }
}
