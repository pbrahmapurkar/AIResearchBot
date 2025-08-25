export interface ApiError {
  field?: string;
  message: string;
}

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let err: ApiError = { message: res.statusText };
    try {
      err = await res.json();
    } catch {
      // ignore
    }
    throw err;
  }
  return res.json() as Promise<T>;
}
