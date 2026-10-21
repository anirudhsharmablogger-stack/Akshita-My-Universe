'use client'

import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { explode } from '@/lib/confetti'
import { config } from '@/lib/memoriesData'
import { useBirthday } from '../birthday-context'

export function CoverPage() {
  const { unlock, unlocked, startMusic, next } = useBirthday()
  const [opening, setOpening] = useState(false)

  const open = () => {
    if (opening) return
    if (unlocked) {
      next()
      return
    }
    setOpening(true)
    startMusic()
    void explode()
    window.setTimeout(unlock, 1500)
  }

  return (
    <div className="flex min-h-full shrink-0 grow flex-col items-center justify-center gap-10 py-6 text-center">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary">{config.birthdayLabel}</p>
        <h1 className="glow-text mt-3 text-balance font-serif text-5xl font-semibold leading-none sm:text-6xl">
          <span className="text-shimmer">A little surprise</span>
        </h1>
        <p className="mt-3 font-serif text-xl italic text-muted-foreground">made only for {config.recipientName}</p>
      </motion.div>

      <motion.button
        type="button"
        onClick={open}
        aria-label={unlocked ? 'Continue to the welcome page' : 'Unlock your birthday gift'}
        className="group relative focus-visible:outline-none"
        animate={opening ? { scale: [1, 1.08, 0.96, 1.15], rotate: [0, -6, 6, 0] } : { rotate: [0, -2.5, 2.5, 0] }}
        transition={opening ? { duration: 0.9 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="absolute -inset-10 rounded-full bg-rose/30 blur-3xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
        <div className="relative h-56 w-56 sm:h-64 sm:w-64">
          <motion.div
            className="absolute inset-x-0 top-0 z-10 h-[30%]"
            animate={opening ? { y: -140, rotate: -24, opacity: 0 } : { y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="absolute -top-9 left-1/2 flex -translate-x-1/2 items-end">
              <span className="block h-10 w-14 -rotate-[28deg] rounded-[50%] border-[7px] border-gold shadow-[0_0_14px_var(--gold)]" />
              <span className="block h-10 w-14 rotate-[28deg] rounded-[50%] border-[7px] border-gold shadow-[0_0_14px_var(--gold)]" />
            </div>
            <div className="absolute inset-x-[-6%] bottom-0 h-full rounded-xl bg-gradient-to-b from-[oklch(0.82_0.09_40)] to-primary shadow-lg" />
            <span className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gold" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-[72%] overflow-hidden rounded-b-2xl rounded-t-md bg-gradient-to-br from-rose via-[oklch(0.62_0.15_350)] to-[oklch(0.45_0.14_320)] shadow-[0_30px_60px_-20px_oklch(0_0_0/0.7)]">
            <span className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gold" />
            <span className="absolute inset-x-0 top-1/3 h-px bg-foreground/10" />
            <motion.span
              className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-gold shadow-[0_0_24px_var(--gold)]"
              animate={opening ? { scale: 0, opacity: 0 } : { scale: [1, 1.08, 1] }}
              transition={opening ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity }}
            >
              <Lock className="size-6" aria-hidden="true" />
            </motion.span>
          </div>
        </div>
      </motion.button>

      <motion.button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-gold to-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_40px_-6px_var(--gold)] transition-transform active:scale-95"
        whileHover={{ scale: 1.04 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Sparkles className="size-5" aria-hidden="true" />
        {unlocked ? 'Continue' : opening ? 'Opening...' : 'Tap to unwrap'}
      </motion.button>
      <p className="text-xs text-muted-foreground">Turn your sound on for the full experience</p>
    </div>
  )
}
