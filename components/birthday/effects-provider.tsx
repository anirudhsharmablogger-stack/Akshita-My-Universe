'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkle } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

type Particle = {
  id: number
  kind: 'heart' | 'spark' | 'rain'
  x: number
  y: number
  dx: number
  dy: number
  size: number
  rotate: number
  duration: number
  color: string
}

type EffectsApi = {
  spawnHearts: (x: number, y: number, count?: number) => void
  spawnSparks: (x: number, y: number, count?: number) => void
  spawnHeartRain: (count?: number) => void
}

const EffectsContext = createContext<EffectsApi | null>(null)

const HEART_COLORS = ['var(--rose)', 'var(--primary)', 'var(--gold)', 'oklch(0.8 0.12 350)']
const MAX_PARTICLES = 140

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const nextId = useRef(0)

  const add = useCallback((items: Omit<Particle, 'id'>[]) => {
    setParticles((prev) => {
      const created = items.map((p) => ({ ...p, id: nextId.current++ }))
      const merged = [...prev, ...created]
      return merged.length > MAX_PARTICLES ? merged.slice(merged.length - MAX_PARTICLES) : merged
    })
  }, [])

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const api = useMemo<EffectsApi>(
    () => ({
      spawnHearts: (x, y, count = 12) => {
        add(
          Array.from({ length: count }, () => ({
            kind: 'heart' as const,
            x,
            y,
            dx: (Math.random() - 0.5) * 220,
            dy: -(180 + Math.random() * 260),
            size: 14 + Math.random() * 22,
            rotate: (Math.random() - 0.5) * 60,
            duration: 1.4 + Math.random() * 1,
            color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
          })),
        )
      },
      spawnSparks: (x, y, count = 6) => {
        add(
          Array.from({ length: count }, (_, i) => {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
            const dist = 30 + Math.random() * 40
            return {
              kind: 'spark' as const,
              x,
              y,
              dx: Math.cos(angle) * dist,
              dy: Math.sin(angle) * dist,
              size: 8 + Math.random() * 8,
              rotate: Math.random() * 180,
              duration: 0.7 + Math.random() * 0.3,
              color: Math.random() > 0.5 ? 'var(--gold)' : 'var(--paper)',
            }
          }),
        )
      },
      spawnHeartRain: (count = 4) => {
        const w = window.innerWidth
        const h = window.innerHeight
        add(
          Array.from({ length: count }, () => ({
            kind: 'rain' as const,
            x: Math.random() * w,
            y: -40,
            dx: (Math.random() - 0.5) * 120,
            dy: h + 80,
            size: 16 + Math.random() * 26,
            rotate: (Math.random() - 0.5) * 90,
            duration: 2.6 + Math.random() * 1.6,
            color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
          })),
        )
      },
    }),
    [add],
  )

  return (
    <EffectsContext.Provider value={api}>
      {children}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute left-0 top-0"
              style={{ color: p.color, width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
              initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.3, rotate: 0 }}
              animate={{
                x: p.x + p.dx,
                y: p.y + p.dy,
                opacity: p.kind === 'spark' ? [0, 1, 0] : [0, 1, 1, 0],
                scale: p.kind === 'spark' ? [0.3, 1, 0.2] : 1,
                rotate: p.rotate,
              }}
              transition={{ duration: p.duration, ease: p.kind === 'rain' ? 'linear' : 'easeOut' }}
              onAnimationComplete={() => remove(p.id)}
            >
              {p.kind === 'spark' ? (
                <Sparkle className="size-full" fill="currentColor" strokeWidth={0} />
              ) : (
                <Heart className="size-full drop-shadow-[0_0_8px_currentColor]" fill="currentColor" strokeWidth={0} />
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </EffectsContext.Provider>
  )
}

export function useEffects() {
  const ctx = useContext(EffectsContext)
  if (!ctx) throw new Error('useEffects must be used within EffectsProvider')
  return ctx
}
