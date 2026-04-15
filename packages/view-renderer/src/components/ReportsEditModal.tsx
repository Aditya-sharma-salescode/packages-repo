import { type CSSProperties, useCallback, useMemo } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import {
  ReportsProvider,
  ReportConfigPage,
} from '@aditya-sharma-salescode/reports-setup'
import type { AppConfig, ViewMetaReport, ReportCard } from '@aditya-sharma-salescode/reports-setup'
import { useViewRenderer } from '../context/ViewRendererContext'
import {
  buildReportsConfig,
  applyReportsConfigUpdate,
  viewMetaToReportCards,
  reportCardsToViewMeta,
} from '../utils/reportsConfigUtils'

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
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
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
  } as CSSProperties,
}

export function ReportsEditModal({ reportId, onClose }: ReportsEditModalProps) {
  const { currentNodeMeta, draftMap, setDraftMap } = useViewRenderer()
  const catalog = (currentNodeMeta?.data?.reports_catalog ?? []) as ViewMetaReport[]

  const appConfig = useMemo(
    () => buildReportsConfig(draftMap, catalog),
    [draftMap, catalog],
  )

  const handleConfigUpdate = useCallback(
    (updated: AppConfig) => applyReportsConfigUpdate(updated, setDraftMap),
    [setDraftMap],
  )

  // Convert enabled report_list → ReportCard[] for ReportConfigPage
  const initialCards = useMemo(() => {
    const reportList = appConfig.features?.reports?.config?.report_list ?? []
    return viewMetaToReportCards(reportList)
  }, [appConfig])

  // When ReportConfigPage mutates cards, convert back and push into draftMap
  const handleCardsUpdate = useCallback(
    (cards: ReportCard[]) => {
      const updatedReportList = reportCardsToViewMeta(cards)
      const updatedConfig: AppConfig = {
        ...appConfig,
        features: {
          ...appConfig.features,
          reports: {
            ...appConfig.features?.reports,
            enabled: true,
            config: {
              ...appConfig.features?.reports?.config,
              report_list: updatedReportList,
            },
          },
        },
      }
      applyReportsConfigUpdate(updatedConfig, setDraftMap)
    },
    [appConfig, setDraftMap],
  )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

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
          <MemoryRouter initialEntries={['/report-config']}>
            <ReportsProvider
              config={{
                initialConfig: appConfig,
                onConfigUpdate: handleConfigUpdate,
                initialCards,
                onCardsUpdate: handleCardsUpdate,
                selectedReportId: reportId,
              }}
            >
              <Routes>
                <Route path="/report-config" element={<ReportConfigPage />} />
                <Route path="*" element={<ReportConfigPage />} />
              </Routes>
            </ReportsProvider>
          </MemoryRouter>
        </div>
      </div>
    </div>
  )
}
