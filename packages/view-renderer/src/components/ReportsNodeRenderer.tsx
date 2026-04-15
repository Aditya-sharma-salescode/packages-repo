import { useViewRenderer } from '../context/ViewRendererContext'

// --- COMMENTED OUT: reports-setup package integration ---
// import { useMemo, useCallback } from 'react'
// import { ReportsProvider, ManageReports } from '@aditya-sharma-salescode/reports-setup'
// import type { AppConfig, ViewMetaReport } from '@aditya-sharma-salescode/reports-setup'
// import { buildReportsConfig, applyReportsConfigUpdate } from '../utils/reportsConfigUtils'

export function ReportsNodeRenderer() {
  const { currentNodeMeta, handleAdvancedSettings } = useViewRenderer()
  const catalog = (currentNodeMeta?.data?.reports_catalog ?? []) as Record<string, unknown>[]

  // --- COMMENTED OUT: original package usage ---
  // const portalConfig = useMemo(
  //   () => buildReportsConfig(draftMap, catalog),
  //   [draftMap, catalog],
  // )
  //
  // const handleConfigUpdate = useCallback(
  //   (updated: AppConfig) => applyReportsConfigUpdate(updated, setDraftMap),
  //   [setDraftMap],
  // )
  //
  // const handleEditReport = useCallback(
  //   (reportId: string) => handleAdvancedSettings(reportId),
  //   [handleAdvancedSettings],
  // )
  //
  // return (
  //   <ReportsProvider
  //     config={{
  //       initialConfig: portalConfig,
  //       onConfigUpdate: handleConfigUpdate,
  //       onEditReport: handleEditReport,
  //     }}
  //   >
  //     <ManageReports />
  //   </ReportsProvider>
  // )

  return (
    <div style={{ padding: 24, border: '2px dashed #d1d5db', borderRadius: 12, background: '#f9fafb' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#111827' }}>
        [Placeholder] ReportsNodeRenderer
      </h3>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>
        This will render <code>ManageReports</code> from <code>@aditya-sharma-salescode/reports-setup</code>
      </p>
      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#9ca3af' }}>
        Catalog reports: {catalog.length}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {catalog.map((r, i) => (
          <button
            key={(r.id as string) ?? i}
            onClick={() => handleAdvancedSettings((r.id as string) ?? '')}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {(r.name as string) ?? (r.id as string) ?? `Report ${i}`}
          </button>
        ))}
      </div>
    </div>
  )
}
