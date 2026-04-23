import { useContext } from 'react'
import { ViewRendererContext } from './ViewRendererContext'
import type { ViewRendererContextValue } from './ViewRendererContext'

export function useViewRenderer(): ViewRendererContextValue {
  const ctx = useContext(ViewRendererContext)
  if (!ctx) throw new Error('useViewRenderer must be used within ViewRendererProvider')
  return ctx
}
