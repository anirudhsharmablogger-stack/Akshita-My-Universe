type Note = [frequency: number | null, beats: number]

const N = {
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
}

const MELODY: Note[] = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 3],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 3],
  [null, 2],
]

const BEAT_SECONDS = 0.52

class BirthdayAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicBus: GainNode | null = null
  private timer: number | null = null
  private nextTime = 0
  private index = 0
  private volume = 0.6
  private audioEl: HTMLAudioElement | null = null
  playing = false

  private ensure() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const master = ctx.createGain()
      master.gain.value = this.volume
      master.connect(ctx.destination)

      const musicBus = ctx.createGain()
      musicBus.gain.value = 0.55
      const delay = ctx.createDelay()
      delay.delayTime.value = 0.31
      const feedback = ctx.createGain()
      feedback.gain.value = 0.32
      const wet = ctx.createGain()
      wet.gain.value = 0.38
      musicBus.connect(master)
      musicBus.connect(delay)
      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(wet)
      wet.connect(master)

      this.ctx = ctx
      this.master = master
      this.musicBus = musicBus
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private chime(freq: number, time: number, duration: number, peak: number, dest: AudioNode) {
    const ctx = this.ctx!
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(peak, time + 0.012)
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration)
    env.connect(dest)

    const fundamental = ctx.createOscillator()
    fundamental.type = 'sine'
    fundamental.frequency.value = freq
    fundamental.connect(env)

    const overtone = ctx.createOscillator()
    overtone.type = 'triangle'
    overtone.frequency.value = freq * 2
    const overtoneGain = ctx.createGain()
    overtoneGain.gain.value = 0.18
    overtone.connect(overtoneGain)
    overtoneGain.connect(env)

    fundamental.start(time)
    overtone.start(time)
    fundamental.stop(time + duration + 0.05)
    overtone.stop(time + duration + 0.05)
  }

  private schedule = () => {
    const ctx = this.ctx
    if (!ctx || !this.musicBus) return
    while (this.nextTime < ctx.currentTime + 0.4) {
      const [freq, beats] = MELODY[this.index]
      if (freq) {
        this.chime(freq, this.nextTime, beats * BEAT_SECONDS * 1.6 + 0.7, 0.22, this.musicBus)
        this.chime(freq / 2, this.nextTime, beats * BEAT_SECONDS * 1.4 + 0.5, 0.07, this.musicBus)
      }
      this.nextTime += beats * BEAT_SECONDS
      this.index = (this.index + 1) % MELODY.length
    }
  }

  start(musicUrl?: string) {
    if (this.playing) return
    this.playing = true
    if (musicUrl) {
      if (!this.audioEl) {
        this.audioEl = new Audio(musicUrl)
        this.audioEl.loop = true
      }
      this.audioEl.volume = this.volume
      void this.audioEl.play().catch(() => {
        this.playing = false
      })
      return
    }
    const ctx = this.ensure()
    this.nextTime = ctx.currentTime + 0.1
    this.schedule()
    this.timer = window.setInterval(this.schedule, 100)
  }

  pause() {
    this.playing = false
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    this.audioEl?.pause()
  }

  setVolume(value: number) {
    this.volume = value
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05)
    if (this.audioEl) this.audioEl.volume = value
  }

  pop() {
    const ctx = this.ensure()
    const now = ctx.currentTime
    this.chime(880, now, 0.25, 0.12, this.master!)
    this.chime(1320, now + 0.05, 0.3, 0.08, this.master!)
  }

  cheer() {
    const ctx = this.ensure()
    const master = this.master!
    const now = ctx.currentTime

    ;[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      this.chime(f, now + i * 0.07, 1.2, 0.18, master)
    })

    const length = ctx.sampleRate * 1.8
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1

    const crowd = ctx.createBufferSource()
    crowd.buffer = buffer
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1100
    band.Q.value = 0.7
    const crowdEnv = ctx.createGain()
    crowdEnv.gain.setValueAtTime(0.0001, now)
    crowdEnv.gain.exponentialRampToValueAtTime(0.16, now + 0.15)
    crowdEnv.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
    crowd.connect(band)
    band.connect(crowdEnv)
    crowdEnv.connect(master)
    crowd.start(now)

    for (let i = 0; i < 14; i++) {
      const t = now + 0.1 + Math.random() * 1.3
      const clap = ctx.createBufferSource()
      clap.buffer = buffer
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 1800
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.0001, t)
      env.gain.exponentialRampToValueAtTime(0.22, t + 0.004)
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
      clap.connect(hp)
      hp.connect(env)
      env.connect(master)
      clap.start(t, Math.random(), 0.1)
    }
  }
}

export const birthdayAudio = new BirthdayAudio()
