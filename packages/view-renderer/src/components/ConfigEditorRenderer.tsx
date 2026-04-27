import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { ConfigEditorField, ConfigEditorNodeMeta } from '../types'
import { useViewRenderer } from '../context/useViewRenderer'
import { t } from '../theme'
import { getByPath } from '../utils/pathUtils'
import { resolveTargetKeys } from '../utils/resolveTargetKeys'
import { FieldRenderer } from './FieldRenderer'

export interface ConfigEditorRendererProps {
  node: ConfigEditorNodeMeta
}

const styles = {
  container: {
    padding: '4px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 0,
  } as CSSProperties,
  empty: {
    padding: 24,
    textAlign: 'center' as const,
    color: t.fgMuted,
    fontSize: 13,
  } as CSSProperties,
  fieldWrapper: (open: boolean): CSSProperties => ({
    marginBottom: 16,
    borderRadius: 12,
    border: open ? `1.5px solid ${t.p35}` : '1.5px solid transparent',
    overflow: 'hidden',
    transition: 'border 0.15s ease',
  }),
  advancedSection: {
    borderTop: `1px solid ${t.border}`,
    padding: '10px 16px 6px',
    background: t.card,
  } as CSSProperties,
  advancedHeader: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: t.fgMuted,
    marginBottom: 8,
  } as CSSProperties,
}

export function ConfigEditorRenderer({ node }: ConfigEditorRendererProps) {
  const { draftMap, handleUpdateDraft } = useViewRenderer()
  const allKeys = draftMap ? Object.keys(draftMap) : []
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})

  function toggleExpand(fieldId: string) {
    setExpandedFields((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }))
  }

  function renderField(field: ConfigEditorField, nodeTargetKeys?: string[]) {
    const targetKeys = resolveTargetKeys(field.target_config_keys, nodeTargetKeys ?? node.target_config_keys, allKeys)
    const primaryKey = targetKeys[0]
    const primaryDraft = primaryKey && draftMap ? draftMap[primaryKey] : null
    const currentValue = primaryDraft ? getByPath(primaryDraft, field.target_path) : undefined
    const hasAdvanced = !!field.advanced_config?.length
    const isOpen = expandedFields[field.field_id] ?? false

    return (
      <div key={field.field_id} style={styles.fieldWrapper(isOpen && hasAdvanced)}>
        <FieldRenderer
          field={field}
          value={currentValue}
          onChange={(value) => handleUpdateDraft(field.target_path, value, targetKeys)}
          onAdvancedToggle={hasAdvanced ? () => toggleExpand(field.field_id) : undefined}
          advancedOpen={hasAdvanced ? isOpen : undefined}
        />
        {hasAdvanced && isOpen && (
          <div style={styles.advancedSection}>
            <div style={styles.advancedHeader}>Advanced Settings</div>
            {field.advanced_config!.map((af) => {
              const afTargetKeys = resolveTargetKeys(af.target_config_keys, nodeTargetKeys ?? node.target_config_keys, allKeys)
              const afPrimaryKey = afTargetKeys[0]
              const afDraft = afPrimaryKey && draftMap ? draftMap[afPrimaryKey] : null
              const afValue = afDraft ? getByPath(afDraft, af.target_path) : undefined
              return (
                <FieldRenderer
                  key={af.field_id}
                  field={af}
                  value={afValue}
                  onChange={(v) => handleUpdateDraft(af.target_path, v, afTargetKeys)}
                  compact
                />
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (!node.config || node.config.length === 0) {
    return <div style={styles.empty}>No fields configured for this node.</div>
  }

  return (
    <div style={styles.container}>
      {node.config.map((field) => renderField(field))}
    </div>
  )
}
