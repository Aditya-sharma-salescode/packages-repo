/**
 * All in-package navigations use paths derived from {@link buildFormBuilderRoutes}.
 * Set `routePrefix` on FormBuilderProvider (e.g. `/admin/forms`) so URLs become
 * `/admin/forms/manage-forms`, etc.
 */

export interface FormBuilderResolvedRoutes {
  manageForms: string;
  /** Path to the builder without an activity id (voice / NAVIGATE) */
  formBuilderRoot: string;
  formBuilderActivity: (activityId: string) => string;
  reportConfig: string;
  reportPreview: string;
}

export function buildFormBuilderRoutes(routePrefix: string): FormBuilderResolvedRoutes {
  const p = (routePrefix ?? "").replace(/\/$/, "");
  const withP = (path: string) => {
    const seg = path.startsWith("/") ? path : `/${path}`;
    return p ? `${p}${seg}` : seg;
  };
  return {
    manageForms: withP("/manage-forms"),
    formBuilderRoot: withP("/form-builder"),
    formBuilderActivity: (activityId: string) => withP(`/form-builder/${activityId}`),
    reportConfig: withP("/report-config"),
    reportPreview: withP("/report-preview"),
  };
}

/** Map legacy absolute paths (from voice parsers) to prefixed routes. */
export function resolveLegacyNavigatePath(
  routes: FormBuilderResolvedRoutes,
  legacyPath: string
): string {
  const map: Record<string, string> = {
    "/manage-forms": routes.manageForms,
    "/form-builder": routes.formBuilderRoot,
    "/report-config": routes.reportConfig,
    "/report-preview": routes.reportPreview,
  };
  return map[legacyPath] ?? legacyPath;
}
