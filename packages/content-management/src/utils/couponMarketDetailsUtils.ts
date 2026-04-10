export function getPriorityLabel(priority?: unknown) {
  if (priority == null) return "";
  return String(priority);
}

export const DB_COLUMN_NAME_MAP_COLUMN_NAME: Record<string, string> = {};

export function getMarketTabsList() {
  return [];
}

export function getOutletTabsList() {
  return [];
}

export function getEntityPriority(_tabName: string) {
  return 0;
}

export async function getMarketDetailsOptions(
  _combinedSelectedValues: any,
  _priority: number,
  _tabName: string,
  _searchText?: string,
  _name?: string
) {
  return [];
}

