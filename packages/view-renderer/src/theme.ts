// CSS variable–backed color tokens for inline styles.
// Values adapt automatically when the `.dark` class is toggled on <html>.
export const t = {
  fg:          'hsl(var(--foreground))',
  fgMuted:     'hsl(var(--muted-foreground))',
  card:        'hsl(var(--card))',
  muted:       'hsl(var(--muted))',
  border:      'hsl(var(--border))',
  primary:     'hsl(var(--primary))',
  primaryFg:   'hsl(var(--primary-foreground))',
  destructive: 'hsl(var(--destructive))',

  // Primary with opacity
  p03: 'hsl(var(--primary) / 0.03)',
  p04: 'hsl(var(--primary) / 0.04)',
  p08: 'hsl(var(--primary) / 0.08)',
  p10: 'hsl(var(--primary) / 0.1)',
  p15: 'hsl(var(--primary) / 0.15)',
  p20: 'hsl(var(--primary) / 0.2)',
  p30: 'hsl(var(--primary) / 0.3)',
  p35: 'hsl(var(--primary) / 0.35)',
  p40: 'hsl(var(--primary) / 0.4)',
} as const
