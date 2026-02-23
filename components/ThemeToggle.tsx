'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useSyncExternalStore, useState } from 'react'

function getThemeSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
}

let themeListeners: Array<() => void> = []

function subscribeToTheme(callback: () => void): () => void {
  themeListeners.push(callback)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => callback()
  mediaQuery.addEventListener('change', handleChange)
  window.addEventListener('storage', handleChange)
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback)
    mediaQuery.removeEventListener('change', handleChange)
    window.removeEventListener('storage', handleChange)
  }
}

function notifyThemeListeners() {
  themeListeners.forEach((l) => l())
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => false
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    const newTheme = !isDark
    if (newTheme) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }
    notifyThemeListeners()
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg background-elevated border background-border"
      aria-label="Toggle theme"
    >
      {!mounted ? (
        <Sun size={20} className="text-primary" />
      ) : isDark ? (
        <Moon size={20} className="text-primary" />
      ) : (
        <Sun size={20} className="text-primary" />
      )}
    </button>
  )
}