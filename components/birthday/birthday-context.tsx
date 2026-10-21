'use client'

import { createContext, useContext } from 'react'

export type BirthdayApi = {
  page: number
  total: number
  direction: number
  unlocked: boolean
  musicPlaying: boolean
  volume: number
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  unlock: () => void
  toggleMusic: () => void
  startMusic: () => void
  setVolume: (value: number) => void
}

export const BirthdayContext = createContext<BirthdayApi | null>(null)

export function useBirthday() {
  const ctx = useContext(BirthdayContext)
  if (!ctx) throw new Error('useBirthday must be used within BirthdayApp')
  return ctx
}
