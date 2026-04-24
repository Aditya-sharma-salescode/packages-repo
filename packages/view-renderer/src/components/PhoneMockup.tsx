import { useState, useEffect, useCallback, type CSSProperties, type ReactNode } from 'react'

export interface PhoneMockupProps {
  children: ReactNode
  /** Fixed pixel width (ignored when responsive=true) */
  width?: number
  /** Fixed pixel height (ignored when responsive=true) */
  height?: number
  /** When true, auto-sizes to maxHeightVh using real phone aspect ratio */
  responsive?: boolean
  /** Viewport-height percentage for responsive mode (default 80) */
  maxHeightVh?: number
  /** Screen aspect ratio as width/height (default 9/19.5 — modern smartphone) */
  aspectRatio?: number
  className?: string
}

const BEZEL = 6
const CHROME_HEIGHT = BEZEL * 2

/** Default modern smartphone aspect ratio (9:19.5 ≈ iPhone 14/15) */
const DEFAULT_ASPECT = 9 / 19.5

function usePhoneDimensions(
  responsive: boolean,
  maxHeightVh: number,
  aspectRatio: number,
  fixedW: number,
  fixedH: number,
) {
  const compute = useCallback(() => {
    if (!responsive) return { screenW: fixedW, screenH: fixedH }
    const maxPx = (window.innerHeight * maxHeightVh) / 100
    const screenH = maxPx - CHROME_HEIGHT
    const screenW = Math.round(screenH * aspectRatio)
    return { screenW, screenH: Math.round(screenH) }
  }, [responsive, maxHeightVh, aspectRatio, fixedW, fixedH])

  const [dims, setDims] = useState(compute)

  useEffect(() => {
    if (!responsive) return
    const update = () => setDims(compute())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [responsive, compute])

  return dims
}

export function PhoneMockup({
  children,
  width = 375,
  height = 720,
  responsive = false,
  maxHeightVh = 80,
  aspectRatio = DEFAULT_ASPECT,
  className,
}: PhoneMockupProps) {
  const { screenW, screenH } = usePhoneDimensions(responsive, maxHeightVh, aspectRatio, width, height)

  const outerWidth = screenW + BEZEL * 2
  const outerHeight = screenH + CHROME_HEIGHT

  return (
    <div className={className} style={outer(outerWidth, outerHeight)}>
      <div style={screen(screenW, screenH)}>
        {children}
      </div>
    </div>
  )
}

const outer = (w: number, h: number): CSSProperties => ({
  width: w,
  height: h,
  flexShrink: 0,
  background: '#111',
  borderRadius: 44,
  padding: `${BEZEL}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: [
    '0 0 0 1px #000',
    '0 0 0 2px #2a2a2a',
    '0 20px 60px rgba(0,0,0,0.5)',
    '0 4px 16px rgba(0,0,0,0.35)',
  ].join(', '),
})

const screen = (w: number, h: number): CSSProperties => ({
  width: w,
  height: h,
  borderRadius: 38,
  overflow: 'hidden',
  background: '#fff',
})
