/**
 * manage/types.ts — PortalConfig data contracts for the form-builder package
 *
 * Mirrors the shape used for the reports-setup AppConfig so both sides
 * of the tenant JSON stay compatible.
 *
 * Structure persisted into the host app's JSON:
 *
 *  features:
 *    app:
 *      enabled: true
 *      config:
 *        schema: Activity[]          ← all forms (enabled + disabled)
 *    reports:
 *      enabled: true
 *      config:
 *        report_list: ActivityReport[] ← only ENABLED activity reports + external reports
 */

import type { Activity } from "../types";

// ─── ActivityReport ────────────────────────────────────────────────────────────

/**
 * Minimal report entry auto-generated for each *enabled* activity.
 * Stored in `features.reports.config.report_list` alongside any
 * reports coming from the ManageReports (reports-setup) package.
 *
 * Convention: id is always `${activity.id}_report` so we can reliably
 * detect and update activity-generated entries vs. external ones.
 */
export interface ActivityReport {
  id: string;          // `${activity.id}_report`
  name: string;        // e.g. "Attendance Report"
  type?: string;       // section group: "Activity Reports"
  description?: string;
  reportName?: string; // snake_case key, e.g. "attendance_report"
  isLiveReport?: boolean;
  dateRangeFilter?: boolean;
  shouldShowCustomFilters?: boolean;
  [key: string]: unknown;
}

// ─── PortalConfig ─────────────────────────────────────────────────────────────

/**
 * The full tenant / app JSON that the consumer manages.
 * `initialConfig` comes in, `onConfigUpdate` sends it back after every change.
 */
export interface PortalConfig {
  app?: Record<string, unknown>;
  features?: {
    /** Activity form schemas */
    app?: {
      enabled?: boolean;
      config?: {
        /** ALL forms, both enabled and disabled. Toggle sets `enabled` flag. */
        schema?: Activity[];
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    /** Reports produced by activities + any standalone reports */
    reports?: {
      enabled?: boolean;
      config?: {
        report_list?: ActivityReport[];
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derive a stable report entry from an activity.
 * The id convention (`${activity.id}_report`) lets `buildPortalConfig`
 * distinguish activity reports from external ones.
 */
export function makeActivityReport(activity: Activity): ActivityReport {
  const slug = activity.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return {
    id: `${activity.id}_report`,
    name: `${activity.name} Report`,
    type: "Activity Reports",
    description:
      activity.description
        ? `Report for ${activity.name}: ${activity.description}`
        : `Report for ${activity.name} activity`,
    reportName: `${slug}_report`,
    isLiveReport: false,
    dateRangeFilter: true,
    shouldShowCustomFilters: false,
  };
}

/**
 * Merge the current `activities` list back into `baseConfig` and return
 * a new config object (no mutation).
 *
 * Rules:
 *  - `features.app.config.schema` ← all activities (enabled + disabled)
 *  - `features.reports.config.report_list` ←
 *       external reports (not activity-generated) preserved as-is
 *     + one auto-generated entry per *enabled* activity
 */
export function buildPortalConfig(
  baseConfig: PortalConfig,
  activities: Activity[],
): PortalConfig {
  const existingReportList =
    baseConfig.features?.reports?.config?.report_list ?? [];

  // Activity-generated report IDs follow the convention `${id}_report`
  const activityReportIdSet = new Set(
    activities.map((a) => `${a.id}_report`),
  );

  // Preserve any reports that are NOT activity-generated
  const externalReports = existingReportList.filter(
    (r) => !activityReportIdSet.has(r.id as string),
  );

  // Enabled activities get an auto-generated report entry
  const activityReports: ActivityReport[] = activities
    .filter((a) => a.enabled)
    .map(makeActivityReport);

  return {
    ...baseConfig,
    features: {
      ...baseConfig.features,
      app: {
        enabled: true,
        ...baseConfig.features?.app,
        config: {
          ...baseConfig.features?.app?.config,
          schema: activities,
        },
      },
      reports: {
        enabled: true,
        ...baseConfig.features?.reports,
        config: {
          ...baseConfig.features?.reports?.config,
          report_list: [...externalReports, ...activityReports],
        },
      },
    },
  };
}
