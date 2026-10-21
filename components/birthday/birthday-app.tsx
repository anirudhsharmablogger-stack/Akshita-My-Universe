'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { config } from '@/lib/memoriesData'
import { BackgroundEffects } from './background-effects'
import { type BirthdayApi, BirthdayContext } from './birthday-context'
import { BottomNav } from './bottom-nav'
import { EffectsProvider } from './effects-provider'
import { MusicPlayer } from './music-player'
import { pages } from './pages/registry'

const flip = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 75 : -75, x: dir > 0 ? '30%' : '-30%', opacity: 0, scale: 0.92 }),
  center: { rotateY: 0, x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -75 : 75, x: dir > 0 ? '-30%' : '30%', opacity: 0, scale: 0.92 }),
}

const SWIPE_IGNORE = '[data-no-swipe], input, textarea, select, [role="dialog"]'

export function BirthdayApp() {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0])
  const [unlocked, setUnlocked] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.6)
  const scrollRef = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null)
  const total = pages.length

  const goTo = useCallback(
    (index: number) => {
      setPage(([current]) => {
        const target = Math.max(0, Math.min(total - 1, index))
        if (target === current) return [current, 0]
        if (!unlocked && target > 0) return [current, 0]
        return [target, target > current ? 1 : -1]
      })
    },
    [total, unlocked],
  )

  const next = useCallback(() => setPage(([p]) => (p >= total - 1 || (!unlocked && p === 0) ? [p, 0] : [p + 1, 1])), [total, unlocked])
  const prev = useCallback(() => setPage(([p]) => (p <= 0 ? [p, 0] : [p - 1, -1])), [])
  const unlock = useCallback(() => {
    setUnlocked(true)
    setPage([1, 1])
  }, [])

  const startMusic = useCallback(() => {
    birthdayAudio.start(config.musicUrl || undefined)
    setMusicPlaying(true)
  }, [])

  const toggleMusic = useCallback(() => {
    if (musicPlaying) {
      birthdayAudio.pause()
      setMusicPlaying(false)
    } else startMusic()
  }, [musicPlaying, startMusic])

  const setVolume = useCallback((value: number) => {
    birthdayAudio.setVolume(value)
    setVolumeState(value)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [page])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const api = useMemo<BirthdayApi>(
    () => ({ page, total, direction, unlocked, musicPlaying, volume, goTo, next, prev, unlock, toggleMusic, startMusic, setVolume }),
    [page, total, direction, unlocked, musicPlaying, volume, goTo, next, prev, unlock, toggleMusic, startMusic, setVolume],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(SWIPE_IGNORE)) return
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now() }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    const fast = performance.now() - start.t < 600
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5 && fast) {
      if (dx < 0) next()
      else prev()
    }
  }

  const { Component, id } = pages[page]

  return (
    <BirthdayContext.Provider value={api}>
      <EffectsProvider>
        <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden">
          <BackgroundEffects />

          <header className="relative z-20 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
            <p className="font-serif text-lg italic text-foreground/80">
              For <span className="text-gold">{config.recipientName}</span>
            </p>
            <MusicPlayer />
          </header>

          <main
            className="relative z-10 flex-1 touch-pan-y [perspective:1400px]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.section
                key={id}
                ref={scrollRef}
                custom={direction}
                variants={flip}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.65, ease: [0.22, 0.9, 0.3, 1] }}
                style={{ transformOrigin: direction >= 0 ? 'left center' : 'right center' }}
                className="no-scrollbar absolute inset-0 flex flex-col overflow-y-auto overscroll-contain px-5 pb-6 pt-3"
                aria-label={`Page ${page + 1} of ${total}: ${pages[page].label}`}
              >
                <Component />
              </motion.section>
            </AnimatePresence>
          </main>

          <BottomNav />
        </div>
      </EffectsProvider>
    </BirthdayContext.Provider>
  )
}
