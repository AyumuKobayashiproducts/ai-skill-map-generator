// クライアント/サーバ両方から使えるシンプルな fetch ラッパー

export async function postJson<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // レスポンスが JSON でない場合もあるので握りつぶす
  }

  if (!res.ok) {
    const message: string =
      (data && typeof data.error === "string" && data.error) ||
      "API リクエストに失敗しました。";
    throw new Error(message);
  }

  return data as TResponse;
}


