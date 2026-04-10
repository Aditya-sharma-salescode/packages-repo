let currentGlobalFilter: any = null;

export function clearGenericFilter() {
  currentGlobalFilter = null;
}

export function getCurrentGlobalFilter() {
  return currentGlobalFilter;
}

export function getCurrentGlobalFilterObject() {
  return currentGlobalFilter ?? {};
}

export function setCurrentGlobalFilterObject(obj: any) {
  currentGlobalFilter = obj;
}

