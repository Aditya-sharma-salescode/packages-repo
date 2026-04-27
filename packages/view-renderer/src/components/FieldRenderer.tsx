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
}

const styles = {
  wrapper: (open: boolean): CSSProperties => ({
    marginBottom: open ? 0 : 16,
  }),
  card: (open: boolean): CSSProperties => ({
    background: t.muted,
    borderRadius: open ? '12px 12px 0 0' : 12,
    padding: 16,
    border: open ? `1.5px solid ${t.p35}` : '1.5px solid transparent',
    transition: 'border 0.15s ease, border-radius 0.15s ease',
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
  settingsBtn: (open: boolean): CSSProperties => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
    background: open ? t.p15 : t.muted,
    color: open ? t.primary : t.fgMuted,
  }),
}

function SettingsIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function SettingsBtn({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button style={styles.settingsBtn(open)} onClick={onToggle}>
      <SettingsIcon />
    </button>
  )
}

export function FieldRenderer({ field, value, onChange, onAdvancedToggle, advancedOpen }: FieldRendererProps) {
  const strValue = value == null ? '' : String(value)
  const hasAdvanced = !!onAdvancedToggle
  const isOpen = !!advancedOpen

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
