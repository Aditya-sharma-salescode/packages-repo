import type { CSSProperties, ReactNode } from 'react'
import type { ConfigEditorNodeMeta, NodeMeta } from '../types'
import { useViewRenderer } from '../context/ViewRendererContext'
import { ConfigEditorRenderer } from './ConfigEditorRenderer'
import { StoreActivityRenderer } from './StoreActivityRenderer'
import { ReportsNodeRenderer } from './ReportsNodeRenderer'
import { FormBuilderModal } from './FormBuilderModal'
import { ReportsEditModal } from './ReportsEditModal'
import { t } from '../theme'

export interface FeatureCardItem {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface MiddleContentProps {
  nodeType?: string
  features?: FeatureCardItem[]
  onToggleFeature?: (featureId: string, enabled: boolean) => void
  renderNode?: (node: NodeMeta) => ReactNode | null
}

const styles = {
  container: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 0',
  } as CSSProperties,
  description: {
    fontSize: 13,
    color: t.fgMuted,
    marginBottom: 12,
  } as CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  } as CSSProperties,
  card: (enabled: boolean): CSSProperties => ({
    cursor: 'pointer',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    transition: 'all 0.15s ease',
    border: enabled ? `1px solid ${t.p30}` : `1px solid ${t.border}`,
    background: enabled ? t.p08 : t.card,
  }),
  checkbox: (enabled: boolean): CSSProperties => ({
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
    background: enabled ? t.primary : 'transparent',
    border: enabled ? 'none' : `2px solid ${t.fgMuted}`,
    transition: 'all 0.15s ease',
  }),
  checkIcon: {
    width: 10,
    height: 10,
    color: t.primaryFg,
  } as CSSProperties,
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: t.fg,
  } as CSSProperties,
  desc: {
    fontSize: 11,
    color: t.fgMuted,
    marginTop: 2,
    lineHeight: '1.4',
  } as CSSProperties,
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: t.fgMuted,
    fontSize: 13,
  } as CSSProperties,
}

function CheckIcon() {
  return (
    <svg
      style={styles.checkIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function FeatureSelectionRenderer({ features = [], onToggleFeature }: {
  features: FeatureCardItem[]
  onToggleFeature?: (featureId: string, enabled: boolean) => void
}) {
  return (
    <div>
      <p style={styles.description}>
        Toggle features on/off for your application.
      </p>
      <div style={styles.grid}>
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => onToggleFeature?.(feature.id, !feature.enabled)}
            style={styles.card(feature.enabled)}
          >
            <div style={styles.checkbox(feature.enabled)}>
              {feature.enabled && <CheckIcon />}
            </div>
            <div>
              <div style={styles.label}>{feature.label}</div>
              <div style={styles.desc}>{feature.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NodeContent({ nodeType, features, onToggleFeature, ctx }: {
  nodeType: string
  features: FeatureCardItem[]
  onToggleFeature: (featureId: string, enabled: boolean) => void
  ctx: ReturnType<typeof useViewRenderer>
}) {
  if (ctx.currentNodeMeta?.data?.reports_catalog && nodeType === 'feature_selection') {
    return (
      <>
        <ReportsNodeRenderer />
        {ctx.advancedSettingsTarget && (
          <ReportsEditModal
            reportId={ctx.advancedSettingsTarget}
            onClose={ctx.closeAdvancedSettings}
          />
        )}
      </>
    )
  }

  if (nodeType === 'feature_selection') {
    return (
      <FeatureSelectionRenderer
        features={features}
        onToggleFeature={onToggleFeature}
      />
    )
  }

  if (nodeType === 'store_activity') {
    if (ctx.advancedSettingsTarget) {
      return (
        <FormBuilderModal
          activityId={ctx.advancedSettingsTarget}
          onClose={ctx.closeAdvancedSettings}
        />
      )
    }
    return (
      <StoreActivityRenderer
        activities={ctx.activityCards}
        onToggleActivity={ctx.handleToggleActivity}
        onAdvancedSettings={ctx.handleAdvancedSettings}
      />
    )
  }

  if (nodeType === 'config_editor') {
    const nodeMeta = ctx.currentNodeMeta as ConfigEditorNodeMeta | null
    if (!nodeMeta) return <div style={styles.empty}>No node selected</div>
    return <ConfigEditorRenderer node={nodeMeta} />
  }

  return (
    <div style={styles.empty}>
      No renderer for node type: {nodeType}
    </div>
  )
}

export function MiddleContent({ nodeType, features, onToggleFeature, renderNode }: MiddleContentProps) {
  const ctx = useViewRenderer()

  if (renderNode && ctx.currentNodeMeta) {
    const custom = renderNode(ctx.currentNodeMeta)
    if (custom !== null) {
      return <div style={styles.container}>{custom}</div>
    }
  }

  const resolvedNodeType = nodeType ?? ctx.currentNodeMeta?.node_type
  const resolvedFeatures = features ?? ctx.featureCards
  const resolvedOnToggle = onToggleFeature ?? ctx.handleToggleFeature

  if (!resolvedNodeType) {
    return <div style={styles.empty}>Select a node</div>
  }

  return (
    <div style={styles.container}>
      <NodeContent
        nodeType={resolvedNodeType}
        features={resolvedFeatures}
        onToggleFeature={resolvedOnToggle}
        ctx={ctx}
      />
    </div>
  )
}
