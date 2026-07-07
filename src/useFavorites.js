import { useState } from 'react'

const STORAGE_KEY = 'croissant.favorites.v1'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  const toggleFavorite = (level, id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      const key = `${level}:${id}`
      next.has(key) ? next.delete(key) : next.add(key)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const isFavorite = (level, id) => favorites.has(`${level}:${id}`)

  return { favorites, toggleFavorite, isFavorite }
}
