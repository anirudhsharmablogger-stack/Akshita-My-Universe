import { motion } from 'framer-motion'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <motion.header
      className="mb-6 text-center"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h1 className="glow-text mt-2 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {subtitle ? <p className="mx-auto mt-2 max-w-xs text-pretty text-sm text-muted-foreground">{subtitle}</p> : null}
    </motion.header>
  )
}
