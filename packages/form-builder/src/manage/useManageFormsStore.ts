/**
 * useManageFormsStore.ts — thin config-bridge Zustand store for ManageForms
 *
 * Responsibilities:
 *  1. Hold the base PortalConfig that the consumer passed in.
 *  2. Expose `init()` so ManageForms can seed the activity store from it.
 *  3. Expose `notifyUpdate()` so every mutation (toggle / add / remove /
 *     schema edit) can push the full updated PortalConfig back to the consumer
 *     via `onConfigUpdate`, and also write a fallback to localStorage.
 *
 * This store deliberately does NOT own the activity list — that remains in
 * `useActivityStore`. This store is purely a persistence bridge.
 *
 * Usage (inside ManageForms):
 *
 *   const { init, notifyUpdate, initialized } = useManageFormsStore();
 *
 *   // mount
 *   useEffect(() => {
 *     const fromConfig = init(initialConfig, onConfigUpdate);
 *     if (fromConfig.length > 0) setActivities(fromConfig);
 *     else loadFromLocalStorage();
 *   }, []);
 *
 *   // after every mutation
 *   const triggerUpdate = () => {
 *     const latest = useActivityStore.getState().activities;
 *     notifyUpdate(latest);
 *   };
 */

import { create } from "zustand";
import type { Activity } from "../types";
import type { PortalConfig } from "./types";
import { buildPortalConfig } from "./types";

const LS_KEY = "manage_forms_portal_config";

interface ManageFormsState {
  _baseConfig: PortalConfig;
  _onUpdate: ((config: PortalConfig) => void) | undefined;
  /** True once `init()` has been called with a non-empty config or a callback. */
  initialized: boolean;

  /**
   * Initialise the store with the consumer's config.
   * Returns any activities found in `features.app.config.schema` so the
   * caller can load them into `useActivityStore` instead of localStorage.
   */
  init: (
    config: PortalConfig,
    onUpdate?: (config: PortalConfig) => void,
  ) => Activity[];

  /**
   * Call this after ANY mutation to the activity list so the updated
   * PortalConfig is emitted to the consumer and written to localStorage.
   */
  notifyUpdate: (activities: Activity[]) => void;
}

export const useManageFormsStore = create<ManageFormsState>((set, get) => ({
  _baseConfig: {},
  _onUpdate: undefined,
  initialized: false,

  // ── init ────────────────────────────────────────────────────────────────

  init(config, onUpdate) {
    set({ _baseConfig: config, _onUpdate: onUpdate, initialized: true });

    // Return activities from config (may be []) so the caller can decide
    // whether to load from config or from localStorage.
    const schema = config.features?.app?.config?.schema;
    return Array.isArray(schema) ? (schema as Activity[]) : [];
  },

  // ── notifyUpdate ─────────────────────────────────────────────────────────

  notifyUpdate(activities) {
    const { _baseConfig, _onUpdate } = get();
    const updated = buildPortalConfig(_baseConfig, activities);

    // Call consumer callback
    _onUpdate?.(updated);

    // Write fallback so FormBuilder (different route) can also read schemas
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch {
      /* storage quota — ignore */
    }
  },
}));
