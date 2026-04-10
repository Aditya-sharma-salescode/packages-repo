export type PopupType = "Alert" | "Error" | "Success";

export type BannerTemplate = { id: string; label: string };
export type BannerElement = any;
export type Banner = any;

export type manageUpdateAccessObj = any;
export type configurationAttributeType = any;

export type optionObj = { label: string; id: string };
export type OptionType = optionObj;

export type blockInnerComponent = any;
export type blockNavigateState = any;
export type blockStateType = any;
export type bucketDesignType = any;

export type bannerData = any;

export const bannerMockData: any[] = [];

// Legacy singleton referenced by existing pages.
// In an isolated package this is just a stub; consumers should wire their own state.
export const store = {
  getState: () => ({
    roleState: { role: { id: "generic" } },
    bannerState: { isUpdated: false },
    genericFilter: {},
  }),
  dispatch: (_action?: any) => undefined,
};

export function openPopup(_type: PopupType, _message: string) {}

export async function getMetaDataConfig() {
  return [];
}

export async function getNewMetaDataConfig() {
  return [];
}

export async function getNewMarkteplaceConfiguration() {
  return [];
}

export function getNewConfiguration() {
  return [];
}

export function getLob() {
  try {
    return JSON.parse(localStorage.authContext ?? "{}")?.user?.lob;
  } catch {
    return undefined;
  }
}

export function getToken() {
  return localStorage.getItem("auth_token") ?? "";
}

export function validateMetaDataResponse(resp: any) {
  if (!resp) return { success: false, message: "Empty response" };
  return { success: true };
}

export function updateConfigRequestBody(body: any) {
  return body;
}

export function transformFromSaleshubPayload(payload: any) {
  return payload;
}

export function transformToSaleshubPayload(payload: any) {
  return payload;
}

export const languageOptions = ["en"] as const;
export const defaultOptions: OptionType[] = [];

export const defaultBlockConfig: any = {};
export const defaultBucketConfig: any = {};

export const manageBannerSearchParams: string[] = [];

export function getCurrentGlobalFilterObject() {
  return {};
}

