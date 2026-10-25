type Context = { request: Request; env: { FITS_API_URL?: string } }
export async function onRequestPost({ request, env }: Context) {
  if (!env.FITS_API_URL) return Response.json({ error: 'FITS analysis is not configured. Set FITS_API_URL to your Python server HTTPS /api/extract endpoint.' }, { status: 503 });
  try {
    const data = await request.formData();
    const file = data.get('fits_file');
    if (!(file instanceof File) || !file.size) return Response.json({ error: 'A non-empty FITS file is required' }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return Response.json({ error: 'FITS files must be 20 MB or smaller' }, { status: 413 });
    const upstream = new URL(env.FITS_API_URL);
    if (upstream.protocol !== 'https:') return Response.json({ error: 'FITS_API_URL must use HTTPS' }, { status: 503 });
    const body = new FormData(); body.append('file', file, file.name);
    const response = await fetch(upstream, { method: 'POST', body, signal: AbortSignal.timeout(30000) });
    if (!response.ok) return Response.json({ error: 'FITS analysis server is unavailable' }, { status: 502 });
    return Response.json(await response.json());
  } catch {
    return Response.json({ error: 'Unable to analyze this FITS file. Check the file and analysis server.' }, { status: 502 });
  }
}
