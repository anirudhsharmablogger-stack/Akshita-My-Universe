'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { explode, starburst } from '@/lib/confetti'
import { config, finale } from '@/lib/memoriesData'
import { useBirthday } from '../birthday-context'
import { useEffects } from '../effects-provider'

export function FinalePage() {
  const { goTo } = useBirthday()
  const { spawnHeartRain, spawnHearts } = useEffects()
  const [raining, setRaining] = useState(false)
  const [popup, setPopup] = useState(false)
  const [hugs, setHugs] = useState(0)
  const popupTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!raining) return
    const id = window.setInterval(() => spawnHeartRain(3), 260)
    return () => window.clearInterval(id)
  }, [raining, spawnHeartRain])

  useEffect(() => () => window.clearTimeout(popupTimer.current), [])

  const hug = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    spawnHearts(r.left + r.width / 2, r.top + r.height / 2, 24)
    spawnHeartRain(12)
    birthdayAudio.cheer()
    void starburst()
    void explode()
    setRaining(true)
    setHugs((h) => h + 1)
    window.clearTimeout(popupTimer.current)
    popupTimer.current = window.setTimeout(() => setPopup(true), 1100)
  }

  return (
    <div className="flex min-h-full shrink-0 grow flex-col items-center justify-center gap-8 py-6 text-center">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">The very last page</p>
        <h1 className="glow-text mt-3 font-serif text-5xl font-semibold leading-tight">{finale.heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{finale.subheading}</p>
      </motion.div>

      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            aria-hidden="true"
            className="absolute size-52 rounded-full border border-rose/50"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: ring * 0.8, ease: 'easeOut' }}
          />
        ))}
        <motion.button
          type="button"
          onClick={hug}
          whileTap={{ scale: 0.88 }}
          animate={{ scale: [1, 1.07, 1, 1.1, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex size-52 flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-br from-rose via-[oklch(0.68_0.14_15)] to-primary text-primary-foreground shadow-[0_0_80px_-10px_var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Heart className="size-14" fill="currentColor" aria-hidden="true" />
          <span className="px-6 font-serif text-2xl font-semibold leading-tight">Send a Virtual Hug</span>
        </motion.button>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {hugs === 0 ? `${config.recipientName}, this one is waiting for you.` : `${hugs} ${hugs === 1 ? 'hug' : 'hugs'} delivered with love`}
      </p>

      {raining ? (
        <button
          type="button"
          onClick={() => setRaining(false)}
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Pause the heart shower
        </button>
      ) : null}

      <AnimatePresence>
        {popup ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopup(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="finale-title"
              className="relative w-full max-w-sm rounded-3xl border border-gold/40 bg-popover p-7 text-center shadow-[0_0_80px_-10px_var(--rose)]"
              initial={{ scale: 0.6, rotate: -6, y: 40 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPopup(false)}
                className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close message"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
              <motion.span
                className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose/20 text-rose"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                <Heart className="size-8" fill="currentColor" aria-hidden="true" />
              </motion.span>
              <h2 id="finale-title" className="text-shimmer mt-4 font-serif text-4xl font-bold">
                {finale.popupTitle}
              </h2>
              <p className="mt-3 text-pretty font-serif text-lg italic leading-snug text-foreground/90">{finale.popupMessage}</p>
              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPopup(false)}
                  className="rounded-full bg-gradient-to-r from-primary via-gold to-primary py-3 text-sm font-semibold text-primary-foreground"
                >
                  Keep the hearts coming
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPopup(false)
                    setRaining(false)
                    goTo(1)
                  }}
                  className="inline-flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Relive it from the start
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
