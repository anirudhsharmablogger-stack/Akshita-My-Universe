'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { explode } from '@/lib/confetti'
import { bucketList } from '@/lib/memoriesData'
import { useEffects } from '../effects-provider'
import { PageHeader } from '../page-header'

type Item = { id: number; text: string; done: boolean }

export function BucketListPage() {
  const { spawnHearts } = useEffects()
  const [items, setItems] = useState<Item[]>(() => bucketList.map((text, id) => ({ id, text, done: false })))
  const [draft, setDraft] = useState('')
  const doneCount = items.filter((i) => i.done).length
  const progress = items.length ? doneCount / items.length : 0

  const toggle = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const target = items.find((i) => i.id === id)
    if (!target) return
    const nextItems = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    setItems(nextItems)
    if (!target.done) {
      const r = e.currentTarget.getBoundingClientRect()
      spawnHearts(r.left + 24, r.top + r.height / 2, 8)
      birthdayAudio.pop()
      if (nextItems.every((i) => i.done)) void explode()
    }
  }

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim().slice(0, 80)
    if (!text) return
    setItems((prev) => [...prev, { id: Date.now(), text, done: false }])
    setDraft('')
  }

  return (
    <div className="py-2">
      <PageHeader eyebrow="Next year, together" title="Our promises" subtitle="Tick them off one by one — I'll hold you to every single one." />

      <div className="mb-5">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Bucket list progress</span>
          <span>
            {doneCount} / {items.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={items.length} aria-label="Bucket list progress">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-rose via-primary to-gold" animate={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
            >
              <button
                type="button"
                onClick={(e) => toggle(item.id, e)}
                aria-pressed={item.done}
                className={`glass flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                  item.done ? 'border-gold/50' : 'hover:border-primary/40'
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    item.done ? 'border-gold bg-gold text-accent-foreground' : 'border-primary/60'
                  }`}
                >
                  <AnimatePresence>
                    {item.done ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
                <span className={`text-sm transition-all ${item.done ? 'text-muted-foreground line-through decoration-gold' : ''}`}>
                  {item.text}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <form onSubmit={add} className="mt-4 flex gap-2">
        <label htmlFor="new-promise" className="sr-only">
          Add a new promise
        </label>
        <input
          id="new-promise"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
          }}
          placeholder="Add a promise..."
          maxLength={80}
          className="h-11 flex-1 rounded-full border bg-input/30 px-4 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
        />
        <button
          type="submit"
          className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90"
          aria-label="Add promise"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
