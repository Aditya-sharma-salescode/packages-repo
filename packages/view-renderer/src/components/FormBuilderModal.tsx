import { type CSSProperties, type ReactNode, useCallback, useEffect, useMemo, useRef, Component } from 'react'
import { createPortal } from 'react-dom'

class FormBuilderErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) {
    console.error('[FormBuilderModal] ErrorBoundary caught', error)
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: 'red', fontFamily: 'monospace', fontSize: 13 }}>
          <strong>[FormBuilderModal] Render error:</strong>
          <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
            {(this.state.error as Error).message}
            {'\n'}
            {(this.state.error as Error).stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
import {
  MemoryRouter,
  Routes,
  Route,
  UNSAFE_NavigationContext,
  UNSAFE_LocationContext,
} from 'react-router-dom'

// Nulls both LocationContext (checked by useInRouterContext in v6.30+) and
// NavigationContext so MemoryRouter can mount inside an existing BrowserRouter.
const RouterIsolator = ({ children }: { children: ReactNode }) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <UNSAFE_LocationContext.Provider value={null as any}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <UNSAFE_NavigationContext.Provider value={null as any}>
      {children}
    </UNSAFE_NavigationContext.Provider>
  </UNSAFE_LocationContext.Provider>
)
import {
  FormBuilderProvider,
  FormBuilder,
  VoiceActionFeedProvider,
  VoiceAgentProvider,
  useActivityStore,
} from '@aditya-sharma-salescode/form-builder'
import type { ViewMetaReport } from '@aditya-sharma-salescode/reports-setup'
import { useViewRenderer } from '../context/useViewRenderer'
import { t } from '../theme'
import {
  tenantFeatureToActivity,
  buildFormBuilderConfig,
  applyFormBuilderSchemaUpdate,
} from '../utils/formBuilderConfigUtils'

export interface FormBuilderModalProps {
  activityId: string
  onClose: () => void
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: t.card,
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  } as CSSProperties,
  body: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,
}

export function FormBuilderModal({ activityId, onClose }: FormBuilderModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { draftMap, setDraftMap, currentNodeMeta } = useViewRenderer()

  useEffect(() => {
    const featureKeys = draftMap?.app?.features ? Object.keys(draftMap.app.features) : []
    const featureExists = Boolean(draftMap?.app?.features?.[activityId])
    console.log('[FormBuilderModal] mounted', { activityId, featureExists, featureKeys })
    if (overlayRef.current) {
      const r = overlayRef.current.getBoundingClientRect()
      console.log('[FormBuilderModal] overlay rect', { x: r.x, y: r.y, width: r.width, height: r.height })
    }
    return () => console.log('[FormBuilderModal] unmounted', { activityId })
  }, [activityId, draftMap])
  const catalog = (currentNodeMeta?.data?.reports_catalog ?? []) as ViewMetaReport[]

  // Seed the activity store synchronously so FormBuilder finds it on first mount
  useMemo(() => {
    const feature = draftMap?.app?.features?.[activityId]
    console.log('[FormBuilderModal] seeding store', { activityId, featureFound: Boolean(feature) })
    if (!feature) {
      console.warn('[FormBuilderModal] feature not found in draftMap.app.features — FormBuilder will render empty', { activityId })
      return
    }
    try {
      const activity = tenantFeatureToActivity(activityId, feature)
      console.log('[FormBuilderModal] activity built', { activityId, schemaKeys: activity.schema ? Object.keys(activity.schema) : [] })
      const store = useActivityStore.getState()
      const existing = store.getActivity(activityId)
      if (!existing || JSON.stringify(existing.schema) !== JSON.stringify(activity.schema)) {
        store.setActivities([activity])
        console.log('[FormBuilderModal] store.setActivities called')
      }
      store.selectActivity(activityId)
      console.log('[FormBuilderModal] store.selectActivity called', { activityId })
    } catch (err) {
      console.error('[FormBuilderModal] error seeding activity store', err)
    }
  }, [activityId, draftMap])

  const portalConfig = useMemo(() => {
    try {
      const cfg = buildFormBuilderConfig(draftMap, catalog)
      console.log('[FormBuilderModal] portalConfig built', { hasApp: Boolean(cfg?.features?.app), catalogLength: catalog.length })
      return cfg
    } catch (err) {
      console.error('[FormBuilderModal] error building portalConfig', err)
      return undefined
    }
  }, [draftMap, catalog])

  const handleClose = useCallback(() => {
    const updatedActivity = useActivityStore.getState().getActivity(activityId)
    if (updatedActivity) {
      applyFormBuilderSchemaUpdate(activityId, updatedActivity.schema, setDraftMap)
    }
    onClose()
  }, [activityId, setDraftMap, onClose])

  // createPortal escapes any CSS transform ancestor (eg. framer-motion motion.div)
  // that would otherwise confine position:fixed to the transformed container.
  return createPortal(
    <div ref={overlayRef} style={styles.overlay}>
      <div style={styles.body}>
        <FormBuilderErrorBoundary>
        <RouterIsolator>
        <MemoryRouter initialEntries={[`/form-builder/${activityId}`]}>
          <FormBuilderProvider
            config={{
              routePrefix: '/form-builder',
              initialConfig: portalConfig,
              onBack: handleClose,
              features: {
                darkModeToggle: false,
                saveButton: false,
                aiPromptBar: false,
                fetchJira: false,
                reports: false,
              },
            }}
          >
            <VoiceActionFeedProvider>
              <VoiceAgentProvider>
                <Routes>
                  <Route path="/form-builder/:activityId" element={<FormBuilder />} />
                  <Route path="/form-builder" element={<FormBuilder />} />
                </Routes>
              </VoiceAgentProvider>
            </VoiceActionFeedProvider>
          </FormBuilderProvider>
        </MemoryRouter>
        </RouterIsolator>
        </FormBuilderErrorBoundary>
      </div>
    </div>,
    document.body,
  )
}
