// --- COMMENTED OUT: reports-setup package types ---
// import type { AppConfig, ViewMetaReport } from '@aditya-sharma-salescode/reports-setup'
// import type { DraftMap } from '../types'
//
// export function buildReportsConfig(
//   draftMap: DraftMap | null,
//   catalog: ViewMetaReport[],
// ): AppConfig {
//   const portalDraft = draftMap?.portal
//   const reportsFeature = portalDraft?.features?.reports
//   return {
//     app: { tenant_id: portalDraft?.tenant_id ?? '' },
//     viewMeta: { reports: catalog },
//     features: {
//       reports: reportsFeature
//         ? { ...reportsFeature }
//         : { enabled: true, config: { report_list: [] } },
//     },
//   }
// }
//
// export function applyReportsConfigUpdate(
//   updated: AppConfig,
//   setDraftMap: (fn: (prev: DraftMap | null) => DraftMap | null) => void,
// ) {
//   setDraftMap((prev) => {
//     if (!prev?.portal) return prev
//     return {
//       ...prev,
//       portal: {
//         ...prev.portal,
//         features: {
//           ...prev.portal.features,
//           reports: {
//             ...prev.portal.features.reports,
//             ...(updated.features?.reports ?? {}),
//           },
//         },
//       },
//     }
//   })
// }
