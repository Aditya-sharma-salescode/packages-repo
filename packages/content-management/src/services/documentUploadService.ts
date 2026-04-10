export async function uploadDocumentsToSalescode(_files: any) {
  return { status: 200, data: { ids: [] as string[] } };
}

export async function fetchDocumentForDisplay(_docId: string) {
  return { status: 200, data: { url: "" } };
}

export async function getMultipleBlobViaDocumentsApi(_ids: any) {
  return { status: 200, data: [] as Blob[] };
}

