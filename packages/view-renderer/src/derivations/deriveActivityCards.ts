import type { ViewMeta, DraftMap, TenantConfigMap, ActivityFieldTag, StoreActivityNodeMeta } from '../types'
import { resolveTargetKeys } from '../utils/resolveTargetKeys'

export interface ActivityCardItem {
  id: string
  label: string
  description: string
  enabled: boolean
  fields: ActivityFieldTag[]
  advanceSettingsHandler?: string
}

/**
 * Extract field tags from either explicit `fields` on the child,
 * or from the form schema inside `activity_default.config.schema`.
 */
function extractFieldTags(child: {
  fields?: ActivityFieldTag[]
  activity_default?: Record<string, unknown>
}): ActivityFieldTag[] {
  // Explicit fields take priority
  if (child.fields?.length) return child.fields

  // Derive from embedded form schema
  const config = child.activity_default?.config as Record<string, unknown> | undefined
  const schema = config?.schema as { sections?: { fields?: { label: string; type: string }[] }[] } | undefined
  if (!schema?.sections) return []

  const tags: ActivityFieldTag[] = []
  for (const section of schema.sections) {
    for (const field of section.fields ?? []) {
      tags.push({ label: field.label, type: field.type as ActivityFieldTag['type'] })
    }
  }
  return tags
}

function extractSchemaFieldTags(draftMap: DraftMap, activityId: string): ActivityFieldTag[] {
  const allKeys = Object.keys(draftMap)
  for (const key of allKeys) {
    const config = draftMap[key]?.features[activityId]?.config as Record<string, unknown> | undefined
    const schema = config?.schema as { sections?: { fields?: { label: string; type: string }[] }[] } | undefined
    if (!schema?.sections) continue
    const tags: ActivityFieldTag[] = []
    for (const section of schema.sections) {
      for (const field of section.fields ?? []) {
        tags.push({ label: field.label, type: field.type as ActivityFieldTag['type'] })
      }
    }
    if (tags.length) return tags
  }
  return []
}

function getTabsArray(config: Record<string, unknown> | undefined): { id: string }[] {
  return Array.isArray(config?.outletActivityTabs) ? (config!.outletActivityTabs as { id: string }[]) : []
}

function getActivityTypesArray(config: Record<string, unknown> | undefined): { type: string; display_name?: string }[] {
  return Array.isArray(config?.activity_types) ? (config!.activity_types as { type: string; display_name?: string }[]) : []
}

export function deriveActivityCards(
  viewMeta: ViewMeta,
  draftMap: DraftMap,
  activeNodeId: string,
  tenantConfigMap?: TenantConfigMap | null,
): ActivityCardItem[] {
  const node = viewMeta.nodes.find((n) => n.node_id === activeNodeId)
  if (!node || node.node_type !== 'store_activity') return []

  const allKeys = Object.keys(draftMap)

  const knownIds = new Set(node.children.map((c) => c.activity_id))

  const cards: ActivityCardItem[] = node.children.map((child) => {
    const targetKeys = resolveTargetKeys(child.target_config_keys, node.target_config_keys, allKeys)

    const enabled = child.activity_default !== undefined
      ? targetKeys.every(
          (key) => draftMap[key]?.features[child.activity_id]?.enabled === true,
        )
      : targetKeys.every((key) => {
          const tabs = (draftMap[key]?.features?.outlet_activity?.config as Record<string, unknown> | undefined)
            ?.outletActivityTabs
          return Array.isArray(tabs) && (tabs as { id: string }[]).some((t) => t.id === child.activity_id)
        })

    return {
      id: child.activity_id,
      label: child.activity_label,
      description: child.activity_description,
      enabled,
      fields: extractFieldTags(child),
      advanceSettingsHandler: child.advance_settings_handler,
    }
  })

  const OUTLET_TAB_BLOCKLIST = new Set(
    (node as StoreActivityNodeMeta).outlet_tab_blocklist ?? [],
  )

  // Discover custom activities from tenantConfigMap + draftMap outlet tabs not in viewMeta children
  const customIds = new Set<string>()
  const targetKeys = resolveTargetKeys(undefined, node.target_config_keys, allKeys)

  for (const key of targetKeys) {
    const draftOaCfg = draftMap[key]?.features?.outlet_activity?.config as Record<string, unknown> | undefined
    for (const tab of getTabsArray(draftOaCfg)) {
      if (!knownIds.has(tab.id) && !OUTLET_TAB_BLOCKLIST.has(tab.id)) customIds.add(tab.id)
    }
    const tenantOaCfg = tenantConfigMap?.[key]?.features?.outlet_activity?.config as Record<string, unknown> | undefined
    for (const tab of getTabsArray(tenantOaCfg)) {
      if (!knownIds.has(tab.id) && !OUTLET_TAB_BLOCKLIST.has(tab.id)) customIds.add(tab.id)
    }
  }

  for (const id of customIds) {
    // enabled = present in draftMap outlet tabs (any target key)
    const enabled = targetKeys.some((key) => {
      const cfg = draftMap[key]?.features?.outlet_activity?.config as Record<string, unknown> | undefined
      return getTabsArray(cfg).some((t) => t.id === id)
    })

    // label: draftMap activity_forms first, then tenantConfig activity_forms, then tab label
    let label = id
    for (const key of targetKeys) {
      const draftAfCfg = draftMap[key]?.features?.activity_forms?.config as Record<string, unknown> | undefined
      const match = getActivityTypesArray(draftAfCfg).find((t) => t.type === id)
      if (match?.display_name) { label = match.display_name; break }
    }
    if (label === id) {
      for (const key of targetKeys) {
        const tenantAfCfg = tenantConfigMap?.[key]?.features?.activity_forms?.config as Record<string, unknown> | undefined
        const match = getActivityTypesArray(tenantAfCfg).find((t) => t.type === id)
        if (match?.display_name) { label = match.display_name; break }
      }
    }

    cards.push({
      id,
      label,
      description: '',
      enabled,
      fields: extractSchemaFieldTags(draftMap, id),
      advanceSettingsHandler: 'form-package',
    })
  }

  return cards
}
