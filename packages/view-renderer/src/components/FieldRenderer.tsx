import type { CSSProperties } from 'react'
import type { ConfigEditorField } from '../types'
import { ColorPickerInput } from './ColorPickerInput'
import { ImageUploadInput } from './ImageUploadInput'
import { ListSelectionInput } from './ListSelectionInput'
import { ArrayListEditor } from './ArrayListEditor'
import { t } from '../theme'

export interface FieldRendererProps {
  field: ConfigEditorField
  value: unknown
  onChange: (value: unknown) => void
  onAdvancedToggle?: () => void
  advancedOpen?: boolean
  compact?: boolean
}

const styles = {
  wrapper: (_open: boolean): CSSProperties => ({
    marginBottom: 0,
  }),
  card: (open: boolean): CSSProperties => ({
    background: t.muted,
    borderRadius: open ? '10px 10px 0 0' : 10,
    padding: 16,
  }),
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: t.fg,
    marginBottom: 4,
    display: 'block',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  } as CSSProperties,
  description: {
    fontSize: 11,
    color: t.fgMuted,
    marginBottom: 6,
    lineHeight: '1.4',
  } as CSSProperties,
  input: (readonly?: boolean): CSSProperties => ({
    width: '100%',
    padding: '8px 10px',
    fontSize: 13,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    outline: 'none',
    background: readonly ? t.muted : t.card,
    color: readonly ? t.fgMuted : t.fg,
    boxSizing: 'border-box',
    cursor: readonly ? 'not-allowed' : undefined,
  }),
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } as CSSProperties,
  toggle: (on: boolean): CSSProperties => ({
    width: 40,
    height: 22,
    borderRadius: 11,
    background: on ? t.primary : t.border,
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    flexShrink: 0,
  }),
  toggleKnob: (on: boolean): CSSProperties => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: t.primaryFg,
    position: 'absolute',
    top: 2,
    left: on ? 20 : 2,
    transition: 'left 0.15s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
  }),
  toggleLabel: {
    fontSize: 14,
    color: t.fg,
    fontWeight: 500,
    flex: 1,
  } as CSSProperties,
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  } as CSSProperties,
  select: {
    width: '100%',
    padding: '8px 10px',
    fontSize: 13,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    outline: 'none',
    background: t.card,
    color: t.fg,
    boxSizing: 'border-box' as const,
  } as CSSProperties,
  // ── Compact (advanced section) styles ──
  compactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
    borderBottom: `1px solid ${t.border}`,
  } as CSSProperties,
  compactLastRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
  } as CSSProperties,
  compactToggle: (on: boolean): CSSProperties => ({
    width: 32,
    height: 18,
    borderRadius: 9,
    background: on ? t.primary : t.border,
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    flexShrink: 0,
  }),
  compactKnob: (on: boolean): CSSProperties => ({
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: t.primaryFg,
    position: 'absolute',
    top: 2,
    left: on ? 16 : 2,
    transition: 'left 0.15s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
  }),
  compactLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: t.fg,
    lineHeight: '1.3',
  } as CSSProperties,
  compactDesc: {
    fontSize: 11,
    color: t.fgMuted,
    lineHeight: '1.3',
    marginTop: 1,
  } as CSSProperties,
  compactInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
    borderBottom: `1px solid ${t.border}`,
  } as CSSProperties,
  compactLabelBlock: {
    flex: 1,
    minWidth: 0,
  } as CSSProperties,
  compactLabelText: {
    fontSize: 12,
    fontWeight: 600,
    color: t.fg,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    display: 'block',
  } as CSSProperties,
  compactInput: (readonly?: boolean): CSSProperties => ({
    width: 110,
    flexShrink: 0,
    padding: '5px 8px',
    fontSize: 12,
    border: `1px solid ${t.border}`,
    borderRadius: 6,
    outline: 'none',
    background: readonly ? t.muted : t.card,
    color: readonly ? t.fgMuted : t.fg,
    boxSizing: 'border-box',
  }),
  compactSelect: {
    width: 140,
    flexShrink: 0,
    padding: '5px 8px',
    fontSize: 12,
    border: `1px solid ${t.border}`,
    borderRadius: 6,
    outline: 'none',
    background: t.card,
    color: t.fg,
    boxSizing: 'border-box' as const,
  } as CSSProperties,
  chevronBtn: (open: boolean): CSSProperties => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1.5px solid ${open ? t.primary : t.border}`,
    background: open ? t.p08 : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
    color: open ? t.primary : t.fgMuted,
  }),
}

function GearIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3} />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function SettingsBtn({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button style={styles.chevronBtn(open)} onClick={onToggle}>
      {open ? <ChevronUpIcon /> : <GearIcon />}
    </button>
  )
}

export function FieldRenderer({ field, value, onChange, onAdvancedToggle, advancedOpen, compact }: FieldRendererProps) {
  const strValue = value == null ? '' : String(value)
  const hasAdvanced = !!onAdvancedToggle
  const isOpen = !!advancedOpen

  // ── Compact variants — flat rows, no card background, tight spacing ──
  if (compact) {
    switch (field.input_type) {
      case 'toggle': {
        const boolVal = Boolean(value)
        return (
          <div style={styles.compactRow}>
            <div style={styles.compactToggle(boolVal)} onClick={() => !field.readonly && onChange(!boolVal)}>
              <div style={styles.compactKnob(boolVal)} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.compactLabel}>{field.label}</div>
              {field.description && <div style={styles.compactDesc}>{field.description}</div>}
            </div>
          </div>
        )
      }
      case 'number':
        return (
          <div style={styles.compactInputRow}>
            <div style={styles.compactLabelBlock}>
              <span style={styles.compactLabelText}>{field.label}</span>
              {field.description && <div style={styles.compactDesc}>{field.description}</div>}
            </div>
            <input
              type="number"
              style={styles.compactInput(field.readonly)}
              value={value == null ? '' : Number(value)}
              readOnly={field.readonly}
              min={field.validation?.min}
              max={field.validation?.max}
              onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
        )
      case 'select':
        return (
          <div style={styles.compactInputRow}>
            <div style={styles.compactLabelBlock}>
              <span style={styles.compactLabelText}>{field.label}</span>
              {field.description && <div style={styles.compactDesc}>{field.description}</div>}
            </div>
            <select
              style={styles.compactSelect}
              value={strValue}
              disabled={field.readonly}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">— Select —</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      default: // text
        return (
          <div style={styles.compactInputRow}>
            <div style={styles.compactLabelBlock}>
              <span style={styles.compactLabelText}>{field.label}</span>
              {field.description && <div style={styles.compactDesc}>{field.description}</div>}
            </div>
            <input
              style={styles.compactInput(field.readonly)}
              value={strValue}
              readOnly={field.readonly}
              placeholder={field.label}
              onChange={(e) => onChange(e.target.value || null)}
            />
          </div>
        )
    }
  }

  // ── Standard variants ──
  switch (field.input_type) {
    case 'color_picker':
      return (
        <div style={styles.wrapper(isOpen)}>
          <ColorPickerInput
            label={field.label}
            value={strValue}
            onChange={onChange}
            readonly={field.readonly}
          />
        </div>
      )

    case 'image_upload':
      return (
        <div style={styles.wrapper(isOpen)}>
          <ImageUploadInput
            label={field.label}
            description={field.description}
            value={strValue}
            onChange={(v) => onChange(v)}
            validation={field.validation}
            readonly={field.readonly}
          />
        </div>
      )

    case 'toggle': {
      const boolVal = Boolean(value)
      return (
        <div style={styles.wrapper(isOpen)}>
          <div style={styles.card(isOpen)}>
            <div style={styles.toggleRow}>
              <div
                style={styles.toggle(boolVal)}
                onClick={() => !field.readonly && onChange(!boolVal)}
              >
                <div style={styles.toggleKnob(boolVal)} />
              </div>
              <span style={styles.toggleLabel}>{field.label}</span>
              {hasAdvanced && <SettingsBtn open={isOpen} onToggle={onAdvancedToggle!} />}
            </div>
            {field.description && <div style={{ ...styles.description, marginTop: 6, marginBottom: 0 }}>{field.description}</div>}
          </div>
        </div>
      )
    }

    case 'number':
      return (
        <div style={styles.wrapper(isOpen)}>
          <div style={styles.card(isOpen)}>
            <div style={styles.labelRow}>
              <label style={{ ...styles.label, marginBottom: 0 }}>{field.label}</label>
              {hasAdvanced && <SettingsBtn open={isOpen} onToggle={onAdvancedToggle!} />}
            </div>
            {field.description && <div style={{ ...styles.description, marginTop: 4 }}>{field.description}</div>}
            <input
              type="number"
              style={styles.input(field.readonly)}
              value={value == null ? '' : Number(value)}
              readOnly={field.readonly}
              min={field.validation?.min}
              max={field.validation?.max}
              onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
        </div>
      )

    case 'select':
      return (
        <div style={styles.wrapper(isOpen)}>
          <div style={styles.card(isOpen)}>
            <div style={styles.labelRow}>
              <label style={{ ...styles.label, marginBottom: 0 }}>{field.label}</label>
              {hasAdvanced && <SettingsBtn open={isOpen} onToggle={onAdvancedToggle!} />}
            </div>
            {field.description && <div style={{ ...styles.description, marginTop: 4 }}>{field.description}</div>}
            <select
              style={styles.select}
              value={strValue}
              disabled={field.readonly}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">— Select —</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )

    case 'list_selection': {
      const arrValue = Array.isArray(value) ? value : []
      return (
        <div style={styles.wrapper(isOpen)}>
          <ListSelectionInput
            field={field}
            items={arrValue as Record<string, unknown>[]}
            onChange={(newItems) => onChange(newItems)}
          />
        </div>
      )
    }

    case 'list_editor': {
      const arrValue = Array.isArray(value) ? value : []
      return (
        <div style={styles.wrapper(isOpen)}>
          <div style={styles.card(isOpen)}>
            <label style={styles.label}>{field.label}</label>
            {field.description && <div style={styles.description}>{field.description}</div>}
            <ArrayListEditor
              fields={field.item_fields ?? []}
              items={arrValue as Record<string, unknown>[]}
              identityKey={field.identity_key ?? 'type'}
              labelKey={field.label_key}
              subtitleKey={field.subtitle_key}
              toggleKey={field.toggle_key}
              onItemsChange={(newItems) => onChange(newItems)}
            />
          </div>
        </div>
      )
    }

    case 'text':
    default:
      return (
        <div style={styles.wrapper(isOpen)}>
          <div style={styles.card(isOpen)}>
            <div style={styles.labelRow}>
              <label style={{ ...styles.label, marginBottom: 0 }}>{field.label}</label>
              {hasAdvanced && <SettingsBtn open={isOpen} onToggle={onAdvancedToggle!} />}
            </div>
            {field.description && <div style={{ ...styles.description, marginTop: 4 }}>{field.description}</div>}
            <input
              style={styles.input(field.readonly)}
              value={strValue}
              readOnly={field.readonly}
              placeholder={field.description}
              onChange={(e) => onChange(e.target.value || null)}
            />
          </div>
        </div>
      )
  }
}
