function resolveBackendUrl(): string {
  if ((process as any).browser) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/`;

  return "";
}

export function fetcher(
  path: string,
  init: RequestInit & { f?: typeof fetch }
) {
  const fetcher = init?.f || fetch;

  path = resolveBackendUrl() + path;

  return fetcher(path, init);
}
