'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { useEffects } from './effects-provider'

export function HeartButton({ label = 'Send love to this memory' }: { label?: string }) {
  const { spawnHearts } = useEffects()
  const [count, setCount] = useState(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 14)
    birthdayAudio.pop()
    setCount((c) => c + 1)
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.82 }}
        whileHover={{ scale: 1.06 }}
        className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-rose to-primary text-primary-foreground shadow-[0_0_30px_-4px_var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label={label}
      >
        <Heart className="size-6" fill="currentColor" />
      </motion.button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {count === 0 ? 'Tap to send love' : `${count} ${count === 1 ? 'heart' : 'hearts'} sent`}
      </p>
    </div>
  )
}
