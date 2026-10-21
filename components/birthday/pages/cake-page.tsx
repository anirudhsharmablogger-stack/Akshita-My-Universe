'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Mic, MicOff, RotateCcw, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { birthdayAudio } from '@/lib/birthday-audio'
import { fireworks } from '@/lib/confetti'
import { cake } from '@/lib/memoriesData'
import { PageHeader } from '../page-header'

const CANDLE_COLORS = ['bg-rose', 'bg-gold', 'bg-primary', 'bg-[oklch(0.7_0.14_300)]', 'bg-paper']

function Candle({ lit, color, onBlow, index }: { lit: boolean; color: string; onBlow: () => void; index: number }) {
  return (
    <button
      type="button"
      onClick={onBlow}
      disabled={!lit}
      aria-label={lit ? `Blow out candle ${index + 1}` : `Candle ${index + 1} is out`}
      className="relative flex h-24 w-7 flex-col items-center justify-end"
    >
      <AnimatePresence>
        {lit ? (
          <motion.span
            key="flame"
            className="absolute top-0 flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.2, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <span className="absolute -top-3 size-10 rounded-full bg-glow/40 blur-md" aria-hidden="true" />
            <span
              className="animate-flicker relative block h-7 w-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-[oklch(0.7_0.2_40)] via-gold to-paper shadow-[0_0_18px_6px_var(--glow)]"
              style={{ animationDelay: `${index * 0.13}s` }}
              aria-hidden="true"
            />
          </motion.span>
        ) : (
          <motion.span
            key="smoke"
            className="absolute top-2 block h-6 w-1.5 rounded-full bg-foreground/40 blur-[2px]"
            initial={{ opacity: 0.8, y: 0, scaleY: 0.5 }}
            animate={{ opacity: 0, y: -40, scaleY: 1.6 }}
            transition={{ duration: 1.4 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <span className="mb-0.5 block h-1.5 w-0.5 bg-ink" aria-hidden="true" />
      <span
        className={`block h-14 w-3 rounded-t-sm ${color} bg-[repeating-linear-gradient(135deg,transparent_0_6px,oklch(1_0_0/0.45)_6px_9px)] shadow-inner`}
        aria-hidden="true"
      />
    </button>
  )
}

export function CakePage() {
  const [lit, setLit] = useState<boolean[]>(() => Array(cake.candles).fill(true))
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const celebrated = useRef(false)
  const micCleanup = useRef<(() => void) | null>(null)
  const allOut = lit.every((l) => !l)

  const blow = useCallback((i: number) => {
    setLit((prev) => {
      if (!prev[i]) return prev
      const next = [...prev]
      next[i] = false
      return next
    })
  }, [])

  const blowNext = useCallback(() => {
    setLit((prev) => {
      const i = prev.indexOf(true)
      if (i === -1) return prev
      const next = [...prev]
      next[i] = false
      return next
    })
  }, [])

  const stopMic = useCallback(() => {
    micCleanup.current?.()
    micCleanup.current = null
    setListening(false)
  }, [])

  useEffect(() => {
    if (allOut && !celebrated.current) {
      celebrated.current = true
      birthdayAudio.cheer()
      void fireworks(3000)
      stopMic()
    }
  }, [allOut, stopMic])

  useEffect(() => stopMic, [stopMic])

  const startMic = async () => {
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      const data = new Uint8Array(analyser.fftSize)
      let loud = 0
      let lastBlow = 0
      let raf = 0
      const loop = (t: number) => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const v of data) sum += ((v - 128) / 128) ** 2
        const rms = Math.sqrt(sum / data.length)
        loud = rms > 0.16 ? loud + 1 : 0
        if (loud > 4 && t - lastBlow > 160) {
          lastBlow = t
          blowNext()
        }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      micCleanup.current = () => {
        cancelAnimationFrame(raf)
        stream.getTracks().forEach((track) => track.stop())
        void ctx.close()
      }
      setListening(true)
    } catch {
      setMicError('Microphone unavailable — just tap the candles instead.')
    }
  }

  const relight = () => {
    celebrated.current = false
    setLit(Array(cake.candles).fill(true))
  }

  return (
    <div className="flex min-h-full shrink-0 grow flex-col py-2">
      <PageHeader
        eyebrow="Make a wish"
        title="Blow out the candles"
        subtitle="Close your eyes, make a wish, then tap each flame (or blow into your mic)."
      />

      <div className="relative mx-auto mt-2 flex w-full max-w-xs flex-col items-center" data-no-swipe>
        <div className="relative z-10 flex gap-2.5">
          {lit.map((isLit, i) => (
            <Candle key={i} index={i} lit={isLit} color={CANDLE_COLORS[i % CANDLE_COLORS.length]} onBlow={() => blow(i)} />
          ))}
        </div>

        <div className="relative -mt-1 h-16 w-[62%] rounded-t-2xl bg-gradient-to-b from-paper to-[oklch(0.85_0.05_60)] shadow-inner">
          <div className="absolute inset-x-0 top-0 h-5 rounded-t-2xl bg-[radial-gradient(circle_at_10px_0,var(--rose)_10px,transparent_11px)] bg-[length:20px_20px]" aria-hidden="true" />
        </div>
        <div className="relative h-20 w-[82%] rounded-t-2xl bg-gradient-to-b from-rose to-[oklch(0.55_0.15_355)] shadow-lg">
          <div className="absolute inset-x-0 top-0 h-6 rounded-t-2xl bg-[radial-gradient(circle_at_12px_0,var(--paper)_12px,transparent_13px)] bg-[length:24px_24px]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-4 flex justify-around" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="size-2 rounded-full bg-gold shadow-[0_0_6px_var(--gold)]" />
            ))}
          </div>
        </div>
        <div className="relative h-24 w-full rounded-t-2xl bg-gradient-to-b from-[oklch(0.5_0.13_310)] to-[oklch(0.36_0.1_305)] shadow-xl">
          <div className="absolute inset-x-0 top-0 h-7 rounded-t-2xl bg-[radial-gradient(circle_at_14px_0,var(--primary)_14px,transparent_15px)] bg-[length:28px_28px]" aria-hidden="true" />
          <p className="absolute inset-x-0 bottom-5 text-center font-serif text-2xl italic text-gold">Happy Birthday</p>
        </div>
        <div className="h-3 w-[112%] rounded-full bg-gradient-to-r from-gold/70 via-paper to-gold/70 shadow-[0_10px_30px_-5px_var(--gold)]" aria-hidden="true" />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {!allOut ? (
          <button
            type="button"
            onClick={listening ? stopMic : startMic}
            className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            {listening ? <MicOff className="size-4" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}
            {listening ? 'Listening... blow now!' : 'Blow with microphone'}
          </button>
        ) : null}
        {micError ? <p className="text-xs text-muted-foreground">{micError}</p> : null}
      </div>

      <AnimatePresence>
        {allOut ? (
          <motion.div
            className="glass mt-6 rounded-3xl border border-gold/40 p-6 text-center shadow-[0_0_50px_-10px_var(--gold)]"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.4 }}
            role="status"
          >
            <Sparkles className="mx-auto size-6 text-gold" aria-hidden="true" />
            <h2 className="text-shimmer mt-2 font-serif text-3xl font-semibold">{cake.wishTitle}</h2>
            <p className="mt-3 text-pretty font-serif text-lg italic leading-snug text-foreground/90">{cake.wishMessage}</p>
            <button
              type="button"
              onClick={relight}
              className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Relight the candles
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
