import { type CSSProperties, useCallback } from 'react'
import { useViewRenderer } from '../context/ViewRendererContext'
import type { DraftMap, TenantFeatureConfig } from '../types'

// --- COMMENTED OUT: form-builder + reports-setup package integration ---
// import { useMemo } from 'react'
// import { MemoryRouter, Routes, Route } from 'react-router-dom'
// import {
//   FormBuilderProvider,
//   FormBuilder,
//   VoiceActionFeedProvider,
//   VoiceAgentProvider,
//   useActivityStore,
// } from '@aditya-sharma-salescode/form-builder'
// import type { PortalConfig, Activity, FormSchema } from '@aditya-sharma-salescode/form-builder'
// import type { ViewMetaReport } from '@aditya-sharma-salescode/reports-setup'

export interface FormBuilderModalProps {
  activityId: string
  onClose: () => void
}

// --- COMMENTED OUT: TenantFeatureConfig → Activity converter ---
// /**
//  * Convert a TenantFeatureConfig (from draftMap) into the Activity shape
//  * that form-builder's useActivityStore expects.
//  */
// function tenantFeatureToActivity(
//   activityId: string,
//   feature: TenantFeatureConfig,
// ): Activity {
//   const config = feature.config as Record<string, unknown> | undefined
//   const schema = (config?.schema ?? {}) as FormSchema
//   return {
//     id: activityId,
//     name: schema.formName ?? activityId,
//     description: '',
//     enabled: feature.enabled,
//     schema: {
//       formId: schema.formId ?? activityId,
//       formName: schema.formName ?? activityId,
//       version: schema.version ?? '1.0',
//       sections: schema.sections ?? [],
//       meta: schema.meta ?? {
//         submitLabel: 'Submit',
//         submitEndpoint: '/api/forms/submit',
//         createdAt: new Date().toISOString(),
//       },
//     },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }
// }

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as CSSProperties,
  panel: {
    background: '#fff',
    borderRadius: 12,
    width: '90vw',
    maxWidth: 960,
    maxHeight: '85vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
  } as CSSProperties,
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
  } as CSSProperties,
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 18,
    color: '#6b7280',
  } as CSSProperties,
  body: {
    flex: 1,
    overflow: 'auto',
    padding: 24,
  } as CSSProperties,
}

export function FormBuilderModal({ activityId, onClose }: FormBuilderModalProps) {
  const { draftMap, setDraftMap } = useViewRenderer()

  // --- COMMENTED OUT: activity store seeding ---
  // const feature = draftMap?.app?.features?.[activityId]
  // if (feature) {
  //   const activity = tenantFeatureToActivity(activityId, feature)
  //   const store = useActivityStore.getState()
  //   const existing = store.getActivity(activityId)
  //   if (!existing || JSON.stringify(existing.schema) !== JSON.stringify(activity.schema)) {
  //     store.setActivities([activity])
  //     store.selectActivity(activityId)
  //   }
  // }

  // --- COMMENTED OUT: save-on-close from activity store ---
  // const handleClose = useCallback(() => {
  //   const updatedActivity = useActivityStore.getState().getActivity(activityId)
  //   if (updatedActivity) {
  //     setDraftMap((prev: DraftMap | null) => {
  //       if (!prev?.app) return prev
  //       const currentFeature = prev.app.features[activityId]
  //       if (!currentFeature) return prev
  //       return {
  //         ...prev,
  //         app: {
  //           ...prev.app,
  //           features: {
  //             ...prev.app.features,
  //             [activityId]: {
  //               ...currentFeature,
  //               config: {
  //                 ...(currentFeature.config as Record<string, unknown>),
  //                 schema: updatedActivity.schema,
  //               },
  //             },
  //           },
  //         },
  //       }
  //     })
  //   }
  //   onClose()
  // }, [activityId, setDraftMap, onClose])

  // --- COMMENTED OUT: portalConfig construction ---
  // const { currentNodeMeta } = useViewRenderer()
  // const catalog = (currentNodeMeta?.data?.reports_catalog ?? []) as ViewMetaReport[]
  //
  // const portalConfig: PortalConfig = useMemo(() => ({
  //   app: draftMap?.app ? { tenant_id: draftMap.app.tenant_id } : {},
  //   viewMeta: { reports: catalog },
  //   features: {
  //     app: draftMap?.app?.features?.app
  //       ? { ...(draftMap.app.features.app as unknown as Record<string, unknown>) }
  //       : { enabled: true, config: { schema: [] } },
  //     reports: draftMap?.portal?.features?.reports
  //       ? { ...(draftMap.portal.features.reports as unknown as Record<string, unknown>) }
  //       : { enabled: true, config: { report_list: [] } },
  //   },
  // }), [draftMap, catalog])

  // --- COMMENTED OUT: original render ---
  // return (
  //   <div style={styles.overlay} onClick={handleClose}>
  //     <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
  //       <div style={styles.header}>
  //         <span style={styles.title}>Advanced Settings — {activityId}</span>
  //         <div style={styles.closeBtn} onClick={handleClose}>×</div>
  //       </div>
  //       <div style={styles.body}>
  //         <MemoryRouter initialEntries={[`/form-builder/${activityId}`]}>
  //           <FormBuilderProvider
  //             config={{
  //               routePrefix: '/form-builder',
  //               initialConfig: portalConfig,
  //             }}
  //           >
  //             <VoiceActionFeedProvider>
  //               <VoiceAgentProvider>
  //                 <Routes>
  //                   <Route path="/form-builder/:activityId" element={<FormBuilder />} />
  //                   <Route path="/form-builder" element={<FormBuilder />} />
  //                 </Routes>
  //               </VoiceAgentProvider>
  //             </VoiceActionFeedProvider>
  //           </FormBuilderProvider>
  //         </MemoryRouter>
  //       </div>
  //     </div>
  //   </div>
  // )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const feature = draftMap?.app?.features?.[activityId]
  const schema = feature ? (feature.config as Record<string, unknown>)?.schema as Record<string, unknown> | undefined : undefined

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>Advanced Settings — {activityId}</span>
          <div style={styles.closeBtn} onClick={handleClose}>
            ×
          </div>
        </div>
        <div style={styles.body}>
          <div style={{ padding: 24, border: '2px dashed #d1d5db', borderRadius: 12, background: '#f9fafb' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
              [Placeholder] FormBuilder
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>
              This will render <code>FormBuilder</code> from <code>@aditya-sharma-salescode/form-builder</code>
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
              Activity ID: <code>{activityId}</code>
              <br />
              Feature enabled: {feature?.enabled ? 'yes' : 'no'}
              <br />
              Has schema: {schema ? 'yes' : 'no'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
