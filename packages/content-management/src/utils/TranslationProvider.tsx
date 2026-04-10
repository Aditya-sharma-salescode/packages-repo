import { useMemo } from "react";

export enum TranslationEnum {
  common_portal = "common_portal",
  manage_banner = "manage_banner",
  manage_bucket = "manage_bucket",
  manage_basket = "manage_basket",
  manage_block = "manage_block",
  manage_home_screen = "manage_home_screen",
  homescreen = "homescreen",
}

function interpolate(template: string, params?: Record<string, unknown>) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

export function usePortalTranslation() {
  return useMemo(
    () => ({
      translate: (_scope: TranslationEnum, text: string, params?: Record<string, unknown>) =>
        interpolate(text, params),
    }),
    []
  );
}

