'use client'

import { motion } from 'framer-motion'
import { ChevronsRight } from 'lucide-react'
import { useTypewriter } from '@/hooks/use-typewriter'
import { config, welcome } from '@/lib/memoriesData'
import { useBirthday } from '../birthday-context'

export function WelcomePage() {
  const { next } = useBirthday()
  const { output, done } = useTypewriter(welcome.lines.join('\n\n'), 34, 900)

  return (
    <div className="flex min-h-full shrink-0 grow flex-col justify-center gap-8 py-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary">{welcome.eyebrow}</p>
        <h1 className="glow-text mt-4 font-serif text-6xl font-bold leading-[0.95] sm:text-7xl">
          <span className="block text-foreground">Happy</span>
          <span className="block text-shimmer">Birthday,</span>
          <span className="block italic text-foreground">{config.recipientName}</span>
        </h1>
      </motion.div>

      <div className="glass min-h-48 rounded-3xl border p-6 shadow-2xl">
        <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-foreground/90" aria-live="polite">
          {output}
          <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-0.5 animate-pulse bg-gold" aria-hidden="true" />
        </p>
      </div>

      <motion.button
        type="button"
        onClick={next}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/50 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0.35 }}
      >
        Swipe to begin our story
        <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          <ChevronsRight className="size-4" aria-hidden="true" />
        </motion.span>
      </motion.button>
    </div>
  )
}
