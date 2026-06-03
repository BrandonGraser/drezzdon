export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src');

  if (!src) {
    return new Response('Missing src', { status: 400 });
  }

  const fetchHeaders: Record<string, string> = {};
  const range = request.headers.get('range');
  if (range) fetchHeaders['Range'] = range;

  const upstream = await fetch(src, { headers: fetchHeaders, redirect: 'follow' });

  const responseHeaders: Record<string, string> = {
    'Content-Type': upstream.headers.get('Content-Type') ?? 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400',
  };

  const contentLength = upstream.headers.get('Content-Length');
  if (contentLength) responseHeaders['Content-Length'] = contentLength;

  const contentRange = upstream.headers.get('Content-Range');
  if (contentRange) responseHeaders['Content-Range'] = contentRange;

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
