/**
 * API クライアントモジュール
 * クライアント/サーバ両方から使えるシンプルな fetch ラッパー
 */

interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
  code?: string;
}

export class ApiClientError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message);
    this.code = options?.code;
    this.status = options?.status;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

/**
 * POST リクエストを送信し、JSONレスポンスを取得
 * 
 * @example
 * const result = await postJson<RequestType, ResponseType>('/api/endpoint', { data: 'value' });
 */
export async function postJson<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  let data: TResponse | ApiError | null = null;
  try {
    data = await res.json();
  } catch {
    // レスポンスが JSON でない場合
  }

  if (!res.ok) {
    const errorData = data as ApiError | null;
    const message: string =
      errorData?.error ??
      errorData?.message ??
      `API リクエストに失敗しました (${res.status})`;
    throw new ApiClientError(message, {
      code: errorData?.code,
      status: res.status
    });
  }

  return data as TResponse;
}

/**
 * GET リクエストを送信し、JSONレスポンスを取得
 * 
 * @example
 * const items = await getJson<ItemsResponse>('/api/items');
 */
export async function getJson<TResponse>(url: string): Promise<TResponse> {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  let data: TResponse | ApiError | null = null;
  try {
    data = await res.json();
  } catch {
    // レスポンスが JSON でない場合
  }

  if (!res.ok) {
    const errorData = data as ApiError | null;
    const message: string =
      errorData?.error ??
      errorData?.message ??
      `API リクエストに失敗しました (${res.status})`;
    throw new ApiClientError(message, {
      code: errorData?.code,
      status: res.status
    });
  }

  return data as TResponse;
}

/**
 * PUT リクエストを送信し、JSONレスポンスを取得
 */
export async function putJson<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  let data: TResponse | ApiError | null = null;
  try {
    data = await res.json();
  } catch {
    // レスポンスが JSON でない場合
  }

  if (!res.ok) {
    const errorData = data as ApiError | null;
    const message: string =
      errorData?.error ??
      errorData?.message ??
      `API リクエストに失敗しました (${res.status})`;
    throw new ApiClientError(message, {
      code: errorData?.code,
      status: res.status
    });
  }

  return data as TResponse;
}

/**
 * DELETE リクエストを送信
 */
export async function deleteJson<TResponse>(url: string): Promise<TResponse> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });

  let data: TResponse | ApiError | null = null;
  try {
    data = await res.json();
  } catch {
    // レスポンスが JSON でない場合
  }

  if (!res.ok) {
    const errorData = data as ApiError | null;
    const message: string =
      errorData?.error ??
      errorData?.message ??
      `API リクエストに失敗しました (${res.status})`;
    throw new ApiClientError(message, {
      code: errorData?.code,
      status: res.status
    });
  }

  return data as TResponse;
}
