export type GenericFileUploadValue = {
  file?: File | null;
  url?: string;
};

export const fileTypes = {
  image: "image",
  video: "video",
  any: "any",
} as const;

export const fileExtensions = {
  image: [".png", ".jpg", ".jpeg", ".webp"],
  video: [".mp4", ".webm", ".mov"],
  any: [] as string[],
} as const;

