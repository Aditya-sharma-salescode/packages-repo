import type { CSSProperties } from 'react'
import { useViewRenderer } from '../context/useViewRenderer'
import { t } from '../theme'

export interface Action {
  id: string
  label: string
  variant: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export interface BottomActionBarProps {
  actions?: Action[]
  onAction?: (id: string) => void
}

const styles = {
  bar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    padding: '12px 0',
    borderTop: `1px solid ${t.border}`,
    marginTop: 'auto',
    flexShrink: 0,
  } as CSSProperties,
  btn: (variant: Action['variant'], disabled?: boolean): CSSProperties => {
    const base: CSSProperties = {
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 20px',
      borderRadius: 6,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.15s ease',
    }
    if (variant === 'primary') {
      return { ...base, background: t.primary, color: t.primaryFg }
    }
    if (variant === 'danger') {
      return { ...base, background: t.destructive, color: t.primaryFg }
    }
    return { ...base, background: t.muted, color: t.fg, border: `1px solid ${t.border}` }
  },
}

export function BottomActionBar({ actions, onAction }: BottomActionBarProps) {
  const ctx = useViewRenderer()
  const resolvedActions = actions ?? ctx.actions

  const handleClick = (id: string) => {
    if (onAction) {
      onAction(id)
      return
    }
    if (id === 'save') ctx.handleSave()
    if (id === 'discard') ctx.handleDiscard()
  }

  if (!resolvedActions || resolvedActions.length === 0) return null

  return (
    <div style={styles.bar}>
      {resolvedActions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleClick(action.id)}
          disabled={action.disabled}
          style={styles.btn(action.variant, action.disabled)}
        >
          {action.id === 'save' && ctx.isSaving ? 'Saving...' : action.label}
        </button>
      ))}
    </div>
  )
}
