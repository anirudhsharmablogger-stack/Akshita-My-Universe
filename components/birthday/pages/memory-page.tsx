'use client'

import { motion } from 'framer-motion'
import { CalendarHeart } from 'lucide-react'
import { type Memory, memories } from '@/lib/memoriesData'
import { HeartButton } from '../heart-button'
import { MemoryLayout } from './memory-layouts'

export function MemoryPage({ memory, index }: { memory: Memory; index: number }) {
  return (
    <div className="flex min-h-full shrink-0 grow flex-col justify-center gap-6 py-2">
      <motion.header
        className="flex items-end justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Memory vault {String(index + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
          </p>
          <h1 className="glow-text mt-1 font-serif text-4xl font-semibold leading-none">{memory.title}</h1>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
          <CalendarHeart className="size-3.5" aria-hidden="true" />
          {memory.date}
        </span>
      </motion.header>

      <div className="relative py-2">
        <MemoryLayout memory={memory} />
      </div>

      <motion.div
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          # {memory.caption}
        </span>
        <p className="mx-auto max-w-xs text-pretty font-serif text-xl italic leading-snug text-foreground/90">
          {memory.note}
        </p>
        <HeartButton />
      </motion.div>
    </div>
  )
}
