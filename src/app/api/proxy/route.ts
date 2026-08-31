export async function POST(request: Request) {
  const body = await request.json();
  const { provider, apiKey, url, payload } = body;

  if (!provider || !apiKey || !url || !payload) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return Response.json(
      { error: `${provider} API error: ${res.status}`, details: error },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json(data);
}
