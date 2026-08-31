export async function POST(request: Request) {
  const body = await request.json();
  const { provider, apiKey, url, payload } = body;

  console.log(`[proxy] ${provider} request to ${url}`);

  if (!provider || !apiKey || !url || !payload) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Gemini uses key in URL, not Bearer header
  if (provider !== 'gemini') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error(`[proxy] ${provider} error:`, res.status, error);
    return Response.json(
      { error: `${provider} API error: ${res.status}`, details: error },
      { status: res.status }
    );
  }

  const data = await res.json();
  console.log(`[proxy] ${provider} success`);
  return Response.json(data);
}
