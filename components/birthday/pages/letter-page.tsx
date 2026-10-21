'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { config, letter } from '@/lib/memoriesData'

export function LetterPage() {
  return (
    <div className="py-2">
      <motion.article
        className="relative rounded-sm bg-paper px-6 pb-14 pt-8 text-ink shadow-[0_30px_60px_-15px_oklch(0_0_0/0.7)] sm:px-9"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent 0 31px, oklch(0.5 0.05 40 / 0.12) 31px 32px), radial-gradient(circle at 20% 10%, oklch(1 0 0 / 0.5), transparent 50%), radial-gradient(circle at 90% 90%, oklch(0.75 0.06 60 / 0.35), transparent 55%)',
        }}
        initial={{ opacity: 0, y: 40, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <span aria-hidden="true" className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-rose/50" />
        <p className="text-right text-xs uppercase tracking-[0.25em] text-ink/60">{config.birthdayLabel}</p>
        <motion.h1
          className="mt-4 font-serif text-3xl font-semibold italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {letter.greeting}
        </motion.h1>
        <div className="mt-5 space-y-4">
          {letter.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className="text-pretty font-serif text-lg leading-8"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1.2 + i * 0.6, duration: 0.9 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <motion.div
          className="mt-8 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 + letter.paragraphs.length * 0.6, duration: 0.8 }}
        >
          <p className="font-serif text-lg italic">{letter.signoff}</p>
          <p className="font-serif text-3xl font-semibold italic text-rose">{letter.signature}</p>
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-7 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,oklch(0.7_0.17_15),oklch(0.45_0.16_15))] text-paper shadow-[0_6px_14px_oklch(0_0_0/0.4)]"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2 + letter.paragraphs.length * 0.6, type: 'spring', stiffness: 220, damping: 12 }}
        >
          <Heart className="size-6" fill="currentColor" />
        </motion.span>
      </motion.article>
      <div className="h-12" />
    </div>
  )
}
