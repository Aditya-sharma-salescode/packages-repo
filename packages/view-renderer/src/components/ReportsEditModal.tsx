import { type CSSProperties, useCallback } from 'react'
import { useViewRenderer } from '../context/ViewRendererContext'

// --- COMMENTED OUT: reports-setup + form-builder package integration ---
// import { MemoryRouter, Routes, Route } from 'react-router-dom'
// import {
//   ReportsProvider,
//   ReportConfigPage,
// } from '@aditya-sharma-salescode/reports-setup'
// import type { AppConfig, ViewMetaReport } from '@aditya-sharma-salescode/reports-setup'
// import {
//   VoiceActionFeedProvider,
//   VoiceAgentProvider,
// } from '@aditya-sharma-salescode/form-builder'
// import { buildReportsConfig, applyReportsConfigUpdate } from '../utils/reportsConfigUtils'

export interface ReportsEditModalProps {
  reportId: string
  onClose: () => void
}

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

export function ReportsEditModal({ reportId, onClose }: ReportsEditModalProps) {
  const { draftMap } = useViewRenderer()

  // --- COMMENTED OUT: original package usage ---
  // const catalog = (currentNodeMeta?.data?.reports_catalog ?? []) as ViewMetaReport[]
  //
  // const appConfig = useMemo(
  //   () => buildReportsConfig(draftMap, catalog),
  //   [draftMap, catalog],
  // )
  //
  // const handleConfigUpdate = useCallback(
  //   (updated: AppConfig) => applyReportsConfigUpdate(updated, setDraftMap),
  //   [setDraftMap],
  // )
  //
  // --- Original body was: ---
  // <MemoryRouter initialEntries={[`/report-config/${reportId}`]}>
  //   <ReportsProvider
  //     config={{
  //       initialConfig: appConfig,
  //       onConfigUpdate: handleConfigUpdate,
  //     }}
  //   >
  //     <VoiceActionFeedProvider>
  //       <VoiceAgentProvider>
  //         <Routes>
  //           <Route path="/report-config/:reportId" element={<ReportConfigPage />} />
  //           <Route path="/report-config" element={<ReportConfigPage />} />
  //         </Routes>
  //       </VoiceAgentProvider>
  //     </VoiceActionFeedProvider>
  //   </ReportsProvider>
  // </MemoryRouter>

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const reportsFeature = draftMap?.portal?.features?.reports as Record<string, unknown> | undefined
  const reportList = (reportsFeature?.config as Record<string, unknown>)?.report_list as Record<string, unknown>[] | undefined

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>Report Settings — {reportId}</span>
          <div style={styles.closeBtn} onClick={handleClose}>
            ×
          </div>
        </div>
        <div style={styles.body}>
          <div style={{ padding: 24, border: '2px dashed #d1d5db', borderRadius: 12, background: '#f9fafb' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
              [Placeholder] ReportConfigPage
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>
              This will render <code>ReportConfigPage</code> from <code>@aditya-sharma-salescode/reports-setup</code>
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
              Report ID: <code>{reportId}</code>
              <br />
              Enabled reports in config: {reportList?.length ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
