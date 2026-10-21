'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { timeline } from '@/lib/memoriesData'
import { PageHeader } from '../page-header'

export function TimelinePage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="py-2">
      <PageHeader eyebrow="Chapter one" title="How we met" subtitle="Tap each moment to relive it." />
      <ol className="relative space-y-6 pl-8">
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-gold via-rose to-transparent"
        />
        {timeline.map((event, i) => {
          const isOpen = open === i
          return (
            <motion.li
              key={event.title}
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            >
              <span
                aria-hidden="true"
                className="absolute -left-8 top-5 flex size-6 items-center justify-center rounded-full border border-gold bg-background"
              >
                <span className="size-2.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="glass w-full overflow-hidden rounded-2xl border text-left shadow-xl transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary">
                      {event.date}
                    </span>
                    <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight">{event.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{event.text}</p>
                  </div>
                  <ChevronDown
                    className={`mt-1 size-5 shrink-0 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </div>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="px-4 pb-4">
                        <img
                          src={event.image || '/placeholder.svg'}
                          alt={event.title}
                          className="aspect-[4/3] w-full rounded-xl object-cover"
                          loading="lazy"
                        />
                        <p className="mt-3 font-serif text-lg italic leading-snug text-foreground/90">{event.detail}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
