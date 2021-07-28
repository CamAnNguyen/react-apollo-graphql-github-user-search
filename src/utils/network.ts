import { ResourceState } from "store/types";

export async function createRequest<T extends {} = any>(
  url: string,
  options?: RequestInit
) {
  let response = {} as T;
  let link = "" as string | null;
  let error = null;

  const defaultOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
  };

  const initOptions: RequestInit = {
    mode: "cors",
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, initOptions);

    link = res.headers.get('Link');
    response = await res.json();
  } catch (e) {
    error = e;
    console.error("Network error: ", error);
  }

  return { response, error, link };
}

export async function getJson(path: string, params?: Record<string, any>) {
  const query = (params && `?${new URLSearchParams(params).toString()}`) ?? "";

  return await createRequest(path + query, { method: "GET" });
}

export async function postJson(path: string, body: Record<string, any> = {}) {
  return await createRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function isResourceLoading(status: ResourceState): boolean {
  return status === ResourceState.LOADING;
}

export function isResourceNotFoundOrLoading(status: ResourceState): boolean {
  return status === ResourceState.NOT_FOUND || status === ResourceState.LOADING;
}

export function isResourceFound(status: ResourceState): boolean {
  return status === ResourceState.FOUND;
}
