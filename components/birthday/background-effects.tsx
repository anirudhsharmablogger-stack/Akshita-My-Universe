function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seeded(42)

const BALLOON_COLORS = [
  'oklch(0.72 0.14 10)',
  'oklch(0.79 0.085 40)',
  'oklch(0.83 0.11 78)',
  'oklch(0.65 0.15 300)',
  'oklch(0.78 0.1 350)',
]

const balloons = Array.from({ length: 7 }, (_, i) => ({
  left: 4 + rand() * 88,
  size: 34 + rand() * 26,
  duration: 18 + rand() * 14,
  delay: -rand() * 30,
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
}))

const sparkles = Array.from({ length: 36 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1.5 + rand() * 2.5,
  duration: 2 + rand() * 4,
  delay: -rand() * 6,
}))

export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {sparkles.map((s, i) => (
        <span
          key={`s-${i}`}
          className="animate-twinkle absolute rounded-full bg-glow"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: '0 0 8px var(--glow)',
          }}
        />
      ))}
      {balloons.map((b, i) => (
        <div
          key={`b-${i}`}
          className="animate-balloon absolute top-0 opacity-50"
          style={{ left: `${b.left}%`, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        >
          <div
            className="relative"
            style={{
              width: b.size,
              height: b.size * 1.2,
              borderRadius: '50% 50% 48% 52% / 55% 55% 45% 45%',
              background: `radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.55), transparent 32%), ${b.color}`,
              boxShadow: `inset -6px -8px 14px oklch(0 0 0 / 0.25), 0 0 24px ${b.color}`,
            }}
          >
            <span
              className="absolute left-1/2 top-full -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: `6px solid ${b.color}`,
                transform: 'translateX(-50%) rotate(180deg)',
              }}
            />
          </div>
          <span className="mx-auto block h-16 w-px bg-foreground/25" />
        </div>
      ))}
    </div>
  )
}
