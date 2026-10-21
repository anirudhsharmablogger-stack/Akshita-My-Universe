const COLORS = ['#f2c4a8', '#e89aa8', '#f6d27e', '#c7a2ff', '#fff2dc']

async function load() {
  return (await import('canvas-confetti')).default
}

export async function explode() {
  const confetti = await load()
  const base = { colors: COLORS, zIndex: 60, disableForReducedMotion: true }
  confetti({ ...base, particleCount: 160, spread: 100, startVelocity: 55, origin: { y: 0.6 } })
  setTimeout(() => confetti({ ...base, particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 180)
  setTimeout(() => confetti({ ...base, particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 300)
}

export async function fireworks(durationMs = 2600) {
  const confetti = await load()
  const end = Date.now() + durationMs
  const tick = () => {
    const remaining = end - Date.now()
    if (remaining <= 0) return
    confetti({
      colors: COLORS,
      zIndex: 60,
      disableForReducedMotion: true,
      particleCount: 40,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      gravity: 0.8,
      origin: { x: 0.15 + Math.random() * 0.7, y: Math.random() * 0.4 + 0.1 },
    })
    setTimeout(tick, 260)
  }
  tick()
}

export async function starburst() {
  const confetti = await load()
  const base = {
    colors: ['#f6d27e', '#fff2dc', '#f2c4a8'],
    zIndex: 60,
    disableForReducedMotion: true,
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.94,
    startVelocity: 26,
    shapes: ['star' as const],
  }
  confetti({ ...base, particleCount: 40, scalar: 1.2, origin: { x: 0.5, y: 0.45 } })
  setTimeout(() => confetti({ ...base, particleCount: 30, scalar: 0.9, origin: { x: 0.25, y: 0.3 } }), 150)
  setTimeout(() => confetti({ ...base, particleCount: 30, scalar: 0.9, origin: { x: 0.75, y: 0.3 } }), 300)
}
