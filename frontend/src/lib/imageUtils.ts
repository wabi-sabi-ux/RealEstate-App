const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://localhost:8080";

/**
 * Resolve a property image URL to an absolute path so uploads served from the
 * Spring Boot backend render correctly alongside externally hosted images.
 */
export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const base = API_BASE.replace(/\/?$/, "");
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${base}${normalized}`;
}
