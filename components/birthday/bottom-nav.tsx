'use client'

import { motion } from 'framer-motion'
import { BookHeart, Cake, ChevronLeft, ChevronRight, Gift, Heart, Images, Sparkles } from 'lucide-react'
import { useBirthday } from './birthday-context'
import { pages, type Section, sectionStart } from './pages/registry'

const SECTIONS: { id: Section; label: string; Icon: typeof Gift }[] = [
  { id: 'home', label: 'Home', Icon: Gift },
  { id: 'story', label: 'Story', Icon: BookHeart },
  { id: 'memories', label: 'Photos', Icon: Images },
  { id: 'wishes', label: 'Wishes', Icon: Sparkles },
  { id: 'cake', label: 'Cake', Icon: Cake },
  { id: 'love', label: 'Love', Icon: Heart },
]

export function BottomNav() {
  const { page, total, prev, next, goTo, unlocked } = useBirthday()
  const current = pages[page]

  return (
    <nav
      aria-label="Page navigation"
      className="glass relative z-20 border-t px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      data-no-swipe
    >
      <div className="mb-2 flex items-center gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={page === 0}
          aria-label="Previous page"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border text-foreground transition-opacity disabled:opacity-30"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="truncate font-medium text-foreground">{current.label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground" aria-live="polite">
              Page {page + 1} of {total}
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose via-primary to-gold"
              animate={{ width: `${((page + 1) / total) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={next}
          disabled={page === total - 1 || (!unlocked && page === 0)}
          aria-label="Next page"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      <ul className="grid grid-cols-6">
        {SECTIONS.map(({ id, label, Icon }) => {
          const active = current.section === id
          const disabled = !unlocked && id !== 'home'
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => goTo(sectionStart(id))}
                disabled={disabled}
                aria-current={active ? 'page' : undefined}
                className={`relative flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition-colors disabled:opacity-30 ${
                  active ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {active ? (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-gold/10" aria-hidden="true" />
                ) : null}
                <Icon className="relative size-5" aria-hidden="true" />
                <span className="relative">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
