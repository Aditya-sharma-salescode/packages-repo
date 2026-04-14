/**
 * types.ts — ManageReports data contracts
 *
 * ViewMetaReport  : one entry in the "all available reports" catalog
 * AppConfig       : the full tenant JSON that the consumer passes in / receives back
 */

/**
 * One report descriptor in the viewMeta catalog.
 * Mirrors the shape the user described (and dummyReportCards) but kept flexible
 * with an index signature so custom keys survive round-trips.
 */
export interface ViewMetaReport {
  id: string;
  name: string;
  /** Section grouping shown as a header (e.g. "New Reports", "Transaction Reports") */
  type?: string;
  description?: string;
  reportName?: string;
  getAPI?: string;

  // Common behaviour flags -------------------------------------------------
  isLiveReport?: boolean;
  isPDFReport?: boolean;
  isGSTRReport?: boolean;
  customDownload?: boolean;
  isDistributorView?: boolean;
  dateRangeFilter?: boolean;
  shouldShowCustomFilters?: boolean;
  showAdditionalFilters?: boolean;
  disableValidation?: boolean;

  // Hierarchy / distributor ------------------------------------------------
  salesHierarchyFilter?: {
    enabled?: boolean;
    levelFilterField?: string;
    [key: string]: unknown;
  };
  geographicalHierarchyFilter?: {
    enabled?: boolean;
    levelFilterField?: string;
    [key: string]: unknown;
  };
  distributorFilter?: {
    enabled?: boolean;
    required?: boolean;
    [key: string]: unknown;
  };

  /** Escape hatch: any additional keys the host app adds */
  [key: string]: unknown;
}

/**
 * The full tenant / app configuration JSON.
 *
 * The consumer passes an instance of this as `initialConfig` and receives
 * an updated copy via `onConfigUpdate` after every toggle/edit.
 */
export interface AppConfig {
  app?: Record<string, unknown>;
  features?: {
    reports?: {
      enabled?: boolean;
      services?: Record<string, unknown>;
      config?: {
        report_list?: ViewMetaReport[];
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  /**
   * viewMeta.reports is the master catalog of ALL available reports.
   * ManageReports reads this list and lets the user pick which ones are active.
   */
  viewMeta?: {
    reports?: ViewMetaReport[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Merge the active report_list back into the base config and return a new copy. */
export function buildUpdatedConfig(
  baseConfig: AppConfig,
  reportList: ViewMetaReport[],
): AppConfig {
  return {
    ...baseConfig,
    features: {
      ...baseConfig.features,
      reports: {
        enabled: true,
        services: {},
        ...baseConfig.features?.reports,
        config: {
          ...baseConfig.features?.reports?.config,
          report_list: reportList,
        },
      },
    },
  };
}
