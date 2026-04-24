import { type CSSProperties, type ReactNode, useCallback, useMemo } from 'react'
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
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    minHeight: 0,
  } as CSSProperties,
  body: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
  } as CSSProperties,
}

export function FormBuilderModal({ activityId, onClose }: FormBuilderModalProps) {
  const { draftMap, setDraftMap, currentNodeMeta } = useViewRenderer()
  const catalog = (currentNodeMeta?.data?.reports_catalog ?? []) as ViewMetaReport[]

  // Seed the activity store synchronously so FormBuilder finds it on first mount
  useMemo(() => {
    const feature = draftMap?.app?.features?.[activityId]
    if (!feature) return
    const activity = tenantFeatureToActivity(activityId, feature)
    const store = useActivityStore.getState()
    const existing = store.getActivity(activityId)
    if (!existing || JSON.stringify(existing.schema) !== JSON.stringify(activity.schema)) {
      store.setActivities([activity])
    }
    store.selectActivity(activityId)
  }, [activityId, draftMap])

  const portalConfig = useMemo(
    () => buildFormBuilderConfig(draftMap, catalog),
    [draftMap, catalog],
  )

  const handleClose = useCallback(() => {
    const updatedActivity = useActivityStore.getState().getActivity(activityId)
    if (updatedActivity) {
      applyFormBuilderSchemaUpdate(activityId, updatedActivity.schema, setDraftMap)
    }
    onClose()
  }, [activityId, setDraftMap, onClose])

  return (
    <div style={styles.root}>
      <div style={styles.body}>
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
      </div>
    </div>
  )
}
