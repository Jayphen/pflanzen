function resolveBackendUrl(host: string): string {
  if ((process as any).browser) return "";
  if (process.env.NOW_REGION) return `https://${host}/`;

  return "";
}

export function fetcher(
  path: string,
  init: RequestInit & { f?: any; host: string }
) {
  const fetcher = init?.f || fetch;

  path = resolveBackendUrl(init.host) + path;

  return fetcher(path, init);
}
