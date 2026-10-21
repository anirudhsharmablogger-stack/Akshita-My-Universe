'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Music, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { useBirthday } from './birthday-context'

export function MusicPlayer() {
  const { musicPlaying, toggleMusic, volume, setVolume } = useBirthday()
  const [open, setOpen] = useState(false)
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="relative" data-no-swipe>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="music-panel"
        aria-label="Music controls"
        className="glass relative flex size-10 items-center justify-center rounded-full border text-gold"
      >
        <Music className="size-4" aria-hidden="true" />
        {musicPlaying ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-3" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-rose" />
            <span className="relative size-3 rounded-full bg-rose" />
          </span>
        ) : null}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="music-panel"
            className="glass absolute right-0 top-12 z-30 w-60 rounded-2xl border p-4 shadow-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMusic}
                aria-label={musicPlaying ? 'Pause music' : 'Play music'}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-rose text-primary-foreground"
              >
                {musicPlaying ? <Pause className="size-5" fill="currentColor" /> : <Play className="ml-0.5 size-5" fill="currentColor" />}
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Birthday music box</p>
                <div className="mt-1 flex h-3 items-end gap-0.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((b) => (
                    <motion.span
                      key={b}
                      className="w-1 rounded-full bg-gold"
                      animate={musicPlaying ? { height: ['30%', '100%', '45%', '80%', '30%'] } : { height: '30%' }}
                      transition={{ duration: 1, repeat: Infinity, delay: b * 0.12 }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVolume(volume === 0 ? 0.6 : 0)}
                aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                className="text-muted-foreground hover:text-foreground"
              >
                <VolumeIcon className="size-4" aria-hidden="true" />
              </button>
              <label htmlFor="volume" className="sr-only">
                Volume
              </label>
              <input
                id="volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--gold)]"
                style={{
                  background: `linear-gradient(90deg, var(--gold) ${volume * 100}%, var(--muted) ${volume * 100}%)`,
                }}
              />
              <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{Math.round(volume * 100)}</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
