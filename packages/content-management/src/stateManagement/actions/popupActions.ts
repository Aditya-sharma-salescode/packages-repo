export type PopupType = "Alert" | "Error" | "Success";

let lastPopup: { type: PopupType; message: string } | null = null;

export function openPopup(type: PopupType, message: string) {
  lastPopup = { type, message };
}

export function getLastPopup() {
  return lastPopup;
}

