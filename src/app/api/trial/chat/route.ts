import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(20, '1 h'),
        analytics: true,
      })
    : null;

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'anonymous';
  const deviceId = request.headers.get('x-device-id') || 'no-device';
  return `${ip}:${deviceId}`;
}

export async function POST(request: Request) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return Response.json(
      { error: 'Trial mode is not configured. Please add your own API key.' },
      { status: 503 }
    );
  }

  if (ratelimit) {
    const identifier = getClientIdentifier(request);
    const { success, remaining } = await ratelimit.limit(identifier);
    if (!success) {
      return Response.json(
        {
          error: 'Rate limit exceeded. Please add your own API key for unlimited access.',
          remaining,
        },
        { status: 429 }
      );
    }
  }

  const body = await request.json();
  const { messages, model = 'openai/gpt-oss-120b' } = body;

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'Invalid request: messages array required' }, { status: 400 });
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!res.ok) {
    return Response.json(
      { error: `Groq API error: ${res.status}` },
      { status: res.status }
    );
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
