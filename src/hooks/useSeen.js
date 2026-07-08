import { useState } from 'react'

const STORAGE_KEY = 'croissant.seen.v1'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function useSeen() {
  const [seen, setSeen] = useState(load)

  const toggleSeen = (level, id) => {
    setSeen((prev) => {
      const next = new Set(prev)
      const key = `${level}:${id}`
      next.has(key) ? next.delete(key) : next.add(key)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const isSeen = (level, id) => seen.has(`${level}:${id}`)

  return { seen, toggleSeen, isSeen }
}
