import type { AppConfig, ViewMetaReport, ReportCard, ReportBehaviorConfig } from '@aditya-sharma-salescode/reports-setup'
import type { DraftMap } from '../types'

export function buildReportsConfig(
  draftMap: DraftMap | null,
  catalog: ViewMetaReport[],
): AppConfig {
  const portalDraft = draftMap?.portal
  const reportsFeature = portalDraft?.features?.reports
  return {
    app: { tenant_id: portalDraft?.tenant_id ?? '' },
    viewMeta: { reports: catalog },
    features: {
      reports: reportsFeature
        ? { ...reportsFeature }
        : { enabled: true, config: { report_list: [] } },
    },
  }
}

export function applyReportsConfigUpdate(
  updated: AppConfig,
  setDraftMap: (fn: (prev: DraftMap | null) => DraftMap | null) => void,
) {
  setDraftMap((prev) => {
    if (!prev?.portal) return prev
    return {
      ...prev,
      portal: {
        ...prev.portal,
        features: {
          ...prev.portal.features,
          reports: {
            ...prev.portal.features.reports,
            ...(updated.features?.reports ?? {}),
          },
        },
      },
    }
  })
}

/**
 * Convert ViewMetaReport[] (from draftMap report_list) → ReportCard[]
 * (the shape ReportConfigPage works with internally).
 */
export function viewMetaToReportCards(reports: ViewMetaReport[]): ReportCard[] {
  return reports.map((r) => ({
    id: r.id,
    name: r.name,
    type: 'new' as const,
    filter: 'newFilter' as const,
    isNewReport: true as const,
    isNewReportUi: true as const,
    isMandatory: r.isMandatory as boolean | undefined,
    newReportConfig: {
      reportName: r.reportName ?? '',
      isLiveReport: r.isLiveReport ?? false,
      isPDFReport: r.isPDFReport ?? false,
      isGSTRReport: r.isGSTRReport ?? false,
      customDownload: r.customDownload ?? false,
      dateRangeFilter: r.dateRangeFilter ?? true,
      periodFilter: (r as Record<string, unknown>).periodFilter as boolean ?? false,
      showLast7DaysFilter: (r as Record<string, unknown>).showLast7DaysFilter as boolean ?? true,
      showLast3MonthsFilter: (r as Record<string, unknown>).showLast3MonthsFilter as boolean ?? true,
      shouldShowCustomDateFilter: (r as Record<string, unknown>).shouldShowCustomDateFilter as boolean ?? true,
      dateRangeAllowed: (r as Record<string, unknown>).dateRangeAllowed as number ?? 90,
      gstrYearsRange: (r as Record<string, unknown>).gstrYearsRange as number ?? 2,
      salesHierarchyFilter: {
        enabled: r.salesHierarchyFilter?.enabled ?? true,
        levelFilterField: r.salesHierarchyFilter?.levelFilterField ?? '',
      },
      geographicalHierarchyFilter: {
        enabled: r.geographicalHierarchyFilter?.enabled ?? true,
        levelFilterField: r.geographicalHierarchyFilter?.levelFilterField ?? '',
      },
      distributorFilter: {
        enabled: r.distributorFilter?.enabled ?? true,
        required: r.distributorFilter?.required ?? false,
      },
      shouldShowCustomFilters: r.shouldShowCustomFilters ?? false,
      showAdditionalFilters: r.showAdditionalFilters ?? false,
      mergedFilters: (r as Record<string, unknown>).mergedFilters as ReportBehaviorConfig['mergedFilters'] ?? [],
      sendMetadata: (r as Record<string, unknown>).sendMetadata as boolean ?? false,
      metadataFields: (r as Record<string, unknown>).metadataFields as string[] ?? [],
      getAPI: r.getAPI ?? '/rpt-generic/search?',
    },
  }))
}

/**
 * Convert ReportCard[] back → ViewMetaReport[] so the consumer can
 * write them back into draftMap's report_list.
 */
export function reportCardsToViewMeta(cards: ReportCard[]): ViewMetaReport[] {
  return cards.map((c) => ({
    id: c.id,
    name: c.name,
    reportName: c.newReportConfig.reportName,
    getAPI: c.newReportConfig.getAPI,
    isLiveReport: c.newReportConfig.isLiveReport,
    isPDFReport: c.newReportConfig.isPDFReport,
    isGSTRReport: c.newReportConfig.isGSTRReport,
    customDownload: c.newReportConfig.customDownload,
    dateRangeFilter: c.newReportConfig.dateRangeFilter,
    shouldShowCustomFilters: c.newReportConfig.shouldShowCustomFilters,
    showAdditionalFilters: c.newReportConfig.showAdditionalFilters,
    salesHierarchyFilter: { ...c.newReportConfig.salesHierarchyFilter },
    geographicalHierarchyFilter: { ...c.newReportConfig.geographicalHierarchyFilter },
    distributorFilter: { ...c.newReportConfig.distributorFilter },
  }))
}
