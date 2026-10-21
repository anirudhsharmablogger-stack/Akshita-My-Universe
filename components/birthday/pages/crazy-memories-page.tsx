'use client'

import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Heart, RotateCcw, Undo2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { type CrazyMoment, crazyMoments } from '@/lib/memoriesData'
import { useEffects } from '../effects-provider'
import { PageHeader } from '../page-header'

type Entry = { moment: CrazyMoment; key: string }

function SwipeCard({
  entry,
  depth,
  onSwiped,
  registerFling,
}: {
  entry: Entry
  depth: number
  onSwiped: (dir: number) => void
  registerFling?: (fn: (dir: number) => void) => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-18, 18])
  const loveOpacity = useTransform(x, [20, 120], [0, 1])
  const nextOpacity = useTransform(x, [-120, -20], [1, 0])
  const isTop = depth === 0

  const fling = (dir: number) => {
    void animate(x, dir * 520, { duration: 0.35, ease: 'easeIn' }).then(() => onSwiped(dir))
  }
  if (isTop && registerFling) registerFling(fling)

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={{ x, rotate, zIndex: 10 - depth }}
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 2 ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      drag={isTop ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) fling(info.offset.x > 0 ? 1 : -1)
      }}
      data-no-swipe
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border-4 border-paper bg-card shadow-[0_25px_50px_-12px_oklch(0_0_0/0.7)]">
        <img
          src={entry.moment.image || '/placeholder.svg'}
          alt={entry.moment.title}
          className="pointer-events-none h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5 pt-20">
          <h2 className="font-serif text-3xl font-semibold leading-tight">{entry.moment.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{entry.moment.text}</p>
        </div>
        {isTop ? (
          <>
            <motion.span
              style={{ opacity: loveOpacity }}
              className="absolute left-4 top-5 -rotate-12 rounded-lg border-2 border-rose px-3 py-1 text-lg font-bold uppercase text-rose"
            >
              Loved it
            </motion.span>
            <motion.span
              style={{ opacity: nextOpacity }}
              className="absolute right-4 top-5 rotate-12 rounded-lg border-2 border-gold px-3 py-1 text-lg font-bold uppercase text-gold"
            >
              Next!
            </motion.span>
          </>
        ) : null}
      </div>
    </motion.div>
  )
}

export function CrazyMemoriesPage() {
  const { spawnHearts } = useEffects()
  const cycle = useRef(0)
  const [deck, setDeck] = useState<Entry[]>(() => crazyMoments.map((m) => ({ moment: m, key: `${m.id}-0` })))
  const [seen, setSeen] = useState(1)
  const flingRef = useRef<((dir: number) => void) | null>(null)

  const handleSwiped = (dir: number) => {
    if (dir > 0) {
      spawnHearts(window.innerWidth / 2, window.innerHeight / 2, 16)
      birthdayAudio.pop()
    }
    cycle.current += 1
    setDeck(([first, ...rest]) => [...rest, { moment: first.moment, key: `${first.moment.id}-${cycle.current}` }])
    setSeen((s) => (s % crazyMoments.length) + 1)
  }

  const reset = () => {
    cycle.current += 1
    setDeck(crazyMoments.map((m) => ({ moment: m, key: `${m.id}-${cycle.current}` })))
    setSeen(1)
  }

  return (
    <div className="flex min-h-full shrink-0 grow flex-col py-2">
      <PageHeader eyebrow="Our crazy moments" title="Swipe through the chaos" subtitle="Drag right if you loved it, left for the next one." />
      <div className="relative mx-auto aspect-[3/4] w-[82%] max-w-xs">
        {deck.slice(0, 3).map((entry, depth) => (
          <SwipeCard
            key={entry.key}
            entry={entry}
            depth={depth}
            onSwiped={handleSwiped}
            registerFling={depth === 0 ? (fn) => (flingRef.current = fn) : undefined}
          />
        ))}
      </div>
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => flingRef.current?.(-1)}
          className="flex size-12 items-center justify-center rounded-full border border-gold/60 text-gold transition-transform active:scale-90"
          aria-label="Next moment"
        >
          <Undo2 className="size-5" aria-hidden="true" />
        </button>
        <p className="min-w-16 text-center text-sm text-muted-foreground" aria-live="polite">
          {seen} / {crazyMoments.length}
        </p>
        <button
          type="button"
          onClick={() => flingRef.current?.(1)}
          className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-rose to-primary text-primary-foreground shadow-[0_0_30px_-4px_var(--rose)] transition-transform active:scale-90"
          aria-label="Love this moment"
        >
          <Heart className="size-6" fill="currentColor" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform active:scale-90"
          aria-label="Restart the deck"
        >
          <RotateCcw className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
