'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Star } from 'lucide-react'
import { useState } from 'react'
import type { Memory } from '@/lib/memoriesData'

type LayoutProps = { memory: Memory }

const enter = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
}

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img src={src || '/placeholder.svg'} alt={alt} className={`object-cover ${className}`} draggable={false} />
}

function Polaroid({ memory }: LayoutProps) {
  return (
    <motion.figure {...enter} className="relative mx-auto w-[78%] max-w-xs -rotate-3 bg-paper p-3 pb-14 shadow-[0_25px_50px_-12px_oklch(0_0_0/0.6)]">
      <Photo src={memory.image} alt={memory.caption} className="aspect-[3/4] w-full" />
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-serif text-2xl italic text-ink">
        {memory.caption}
      </figcaption>
    </motion.figure>
  )
}

function Tilt({ memory }: LayoutProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 18 })
  const glare = useTransform(
    x,
    (v) => `linear-gradient(115deg, transparent 20%, oklch(1 0 0 / 0.45) ${(v + 0.5) * 100}%, transparent 80%)`,
  )

  return (
    <motion.div {...enter} style={{ perspective: 900 }} className="mx-auto w-[80%] max-w-xs">
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          x.set((e.clientX - r.left) / r.width - 0.5)
          y.set((e.clientY - r.top) / r.height - 0.5)
        }}
        onPointerLeave={() => {
          x.set(0)
          y.set(0)
        }}
        style={{ rotateX, rotateY }}
        className="preserve-3d relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-15px_oklch(0_0_0/0.7)]"
      >
        <Photo src={memory.image} alt={memory.caption} className="aspect-[3/4] w-full" />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{ background: glare }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4 pt-16">
          <p className="font-serif text-2xl italic">{memory.caption}</p>
          <p className="text-xs text-muted-foreground">Move your finger across the photo</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Neon({ memory }: LayoutProps) {
  return (
    <motion.div {...enter} className="relative mx-auto w-[78%] max-w-xs overflow-hidden rounded-3xl p-[3px] shadow-[0_0_50px_-6px_var(--rose)]">
      <span
        aria-hidden="true"
        className="animate-neon-spin absolute -inset-1/2 bg-[conic-gradient(from_0deg,var(--rose),var(--gold),oklch(0.65_0.2_300),var(--rose))]"
      />
      <div className="relative overflow-hidden rounded-[calc(1.5rem-3px)] bg-background">
        <Photo src={memory.image} alt={memory.caption} className="aspect-[3/4] w-full opacity-90" />
        <p className="absolute inset-x-0 top-4 text-center font-serif text-3xl font-bold italic text-rose [text-shadow:0_0_12px_var(--rose),0_0_30px_var(--rose)]">
          {memory.caption}
        </p>
      </div>
    </motion.div>
  )
}

function Taped({ memory }: LayoutProps) {
  return (
    <motion.div {...enter} className="relative mx-auto w-[80%] max-w-xs rotate-2">
      <div className="bg-[oklch(0.7_0.06_60)] p-4 shadow-[0_25px_50px_-12px_oklch(0_0_0/0.6)]">
        <Photo src={memory.image} alt={memory.caption} className="aspect-[3/4] w-full" />
        <p className="mt-3 text-center font-serif text-xl italic text-ink">{memory.caption}</p>
      </div>
      <span aria-hidden="true" className="absolute -left-5 -top-3 h-8 w-24 -rotate-[30deg] bg-rose/70 shadow-sm [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]" />
      <span aria-hidden="true" className="absolute -right-5 -top-2 h-8 w-24 rotate-[28deg] bg-gold/70 shadow-sm" />
      <span aria-hidden="true" className="absolute -bottom-3 left-1/2 h-8 w-28 -translate-x-1/2 -rotate-3 bg-paper/60 shadow-sm" />
    </motion.div>
  )
}

function Collage({ memory }: LayoutProps) {
  const imgs = memory.images ?? [memory.image]
  return (
    <div className="grid grid-cols-2 gap-3">
      {imgs.slice(0, 4).map((src, i) => (
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.6, rotate: i % 2 ? 8 : -8 }}
          animate={{ opacity: 1, scale: 1, rotate: [-3, 2, -2, 3][i] }}
          transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 160, damping: 14 }}
          className={`overflow-hidden rounded-2xl border-4 border-paper shadow-xl ${i === 0 ? 'row-span-2' : ''}`}
        >
          <Photo src={src} alt={`${memory.caption} photo ${i + 1}`} className={`w-full ${i === 0 ? 'h-full' : 'aspect-square'}`} />
        </motion.div>
      ))}
    </div>
  )
}

function Filmstrip({ memory }: LayoutProps) {
  const imgs = memory.images ?? [memory.image]
  const holes = Array.from({ length: 12 })
  return (
    <motion.div {...enter} className="relative mx-auto w-[72%] max-w-[17rem] -rotate-2 rounded-md bg-[oklch(0.12_0.02_300)] px-7 py-3 shadow-2xl">
      {(['left-2', 'right-2'] as const).map((side) => (
        <div key={side} aria-hidden="true" className={`absolute inset-y-3 ${side} flex flex-col justify-between`}>
          {holes.map((_, i) => (
            <span key={i} className="h-2.5 w-2 rounded-[2px] bg-background/80" />
          ))}
        </div>
      ))}
      <div className="flex flex-col gap-3">
        {imgs.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, filter: 'brightness(3)' }}
            animate={{ opacity: 1, filter: 'brightness(1)' }}
            transition={{ delay: 0.4 + i * 0.35, duration: 0.6 }}
          >
            <Photo src={src} alt={`${memory.caption} frame ${i + 1}`} className="aspect-[4/3] w-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Arch({ memory }: LayoutProps) {
  return (
    <motion.div {...enter} className="relative mx-auto w-[74%] max-w-xs">
      <div className="overflow-hidden rounded-t-full border-[3px] border-gold p-2 shadow-[0_0_40px_-8px_var(--gold)]">
        <div className="overflow-hidden rounded-t-full">
          <Photo src={memory.image} alt={memory.caption} className="aspect-[3/4] w-full" />
        </div>
      </div>
      {[
        'left-[-14px] top-10 size-5',
        'right-[-10px] top-24 size-4',
        'left-[-6px] bottom-16 size-3',
        'right-[-16px] bottom-6 size-6',
      ].map((pos, i) => (
        <motion.span
          key={pos}
          aria-hidden="true"
          className={`absolute text-gold ${pos}`}
          animate={{ scale: [0.7, 1.15, 0.7], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.45 }}
        >
          <Star className="size-full" fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </motion.div>
  )
}

function Magazine({ memory }: LayoutProps) {
  return (
    <motion.div {...enter} className="relative mx-auto w-[82%] max-w-xs overflow-hidden rounded-lg shadow-[0_30px_60px_-15px_oklch(0_0_0/0.7)]">
      <Photo src={memory.image} alt={memory.caption} className="aspect-[3/4] w-full" />
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-background/50 via-transparent to-background/80 p-4">
        <div>
          <p className="font-serif text-5xl font-bold uppercase leading-none tracking-tight text-paper">{memory.title}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Birthday Special Edition</p>
        </div>
        <div className="space-y-1">
          <p className="w-fit bg-rose px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">Exclusive</p>
          <p className="font-serif text-xl italic leading-tight text-paper">{memory.caption}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Stack({ memory }: LayoutProps) {
  const [order, setOrder] = useState(memory.images ?? [memory.image])
  return (
    <button
      type="button"
      onClick={() => setOrder((o) => [...o.slice(1), o[0]])}
      aria-label="Shuffle the photo pile"
      className="relative mx-auto block aspect-[3/4] w-[70%] max-w-[16rem]"
    >
      {order.map((src, i) => {
        const depth = order.length - 1 - i
        return (
          <motion.div
            key={src}
            className="absolute inset-0 bg-paper p-2 pb-8 shadow-xl"
            style={{ zIndex: order.length - i }}
            initial={false}
            animate={{ rotate: [0, -8, 7][i] ?? 0, x: [0, -18, 18][i] ?? 0, y: i * -6, scale: 1 - i * 0.04 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            data-depth={depth}
          >
            <Photo src={src} alt={`${memory.caption} photo ${i + 1}`} className="h-full w-full" />
          </motion.div>
        )
      })}
    </button>
  )
}

export function MemoryLayout({ memory }: LayoutProps) {
  switch (memory.layout) {
    case 'polaroid':
      return <Polaroid memory={memory} />
    case 'tilt':
      return <Tilt memory={memory} />
    case 'neon':
      return <Neon memory={memory} />
    case 'taped':
      return <Taped memory={memory} />
    case 'collage':
      return <Collage memory={memory} />
    case 'filmstrip':
      return <Filmstrip memory={memory} />
    case 'arch':
      return <Arch memory={memory} />
    case 'magazine':
      return <Magazine memory={memory} />
    case 'stack':
      return <Stack memory={memory} />
  }
}
