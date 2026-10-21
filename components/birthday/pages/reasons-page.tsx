'use client'

import { motion } from 'framer-motion'
import { Heart, Mail } from 'lucide-react'
import { useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { reasons } from '@/lib/memoriesData'
import { PageHeader } from '../page-header'

export function ReasonsPage() {
  const [opened, setOpened] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    birthdayAudio.pop()
    setOpened((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="py-2">
      <PageHeader
        eyebrow="Secret envelopes"
        title="Reasons you're special"
        subtitle={`${opened.size} of ${reasons.length} opened — tap an envelope to reveal its note.`}
      />
      <ul className="grid grid-cols-2 gap-3">
        {reasons.map((reason, i) => {
          const isOpen = opened.has(i)
          return (
            <motion.li
              key={reason}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              style={{ perspective: 800 }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isOpen}
                aria-label={isOpen ? `Reason ${i + 1}: ${reason}` : `Open envelope ${i + 1}`}
                className="block aspect-[4/3.4] w-full"
              >
                <motion.div
                  className="preserve-3d relative h-full w-full"
                  animate={{ rotateY: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.3, 0.8, 0.3, 1] }}
                >
                  <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.68_0.12_20)] shadow-lg">
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1/2 bg-[oklch(0.84_0.07_40)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/3 items-center justify-center rounded-full bg-rose text-paper shadow-md"
                    >
                      <Heart className="size-4" fill="currentColor" />
                    </span>
                    <span className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/80">
                      <Mail className="size-3" aria-hidden="true" />
                      No. {i + 1}
                    </span>
                  </div>
                  <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl border border-gold/40 bg-paper p-3 text-center shadow-lg [transform:rotateY(180deg)]">
                    <p className="text-pretty font-serif text-lg font-medium italic leading-tight text-ink">{reason}</p>
                  </div>
                </motion.div>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
