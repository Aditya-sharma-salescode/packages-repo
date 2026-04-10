type NetworkResponse<T = any> = { status: number; data: T };

async function request<T>(method: string, url: string, body?: unknown): Promise<NetworkResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("auth_token");
  if (token) headers.authorization = token;

  const resp = await fetch(url, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body),
  });

  const data = (await resp.json().catch(() => ({}))) as T;
  return { status: resp.status, data };
}

export const defaultTokenNew = "";
export const tokenNew = "";
export const META_DATA_BATCH_API = "";

export function ChannelkartNetworkGet<T = any>(url: string) {
  return request<T>("GET", url);
}
export function ChannelkartNetworkPost<T = any>(url: string, body?: unknown) {
  return request<T>("POST", url, body);
}
export function ChannelkartNetworkDelete<T = any>(url: string) {
  return request<T>("DELETE", url);
}

