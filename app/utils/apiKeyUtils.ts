/**
 * Helpers for Headscale *API keys* (management auth).
 *
 * Do not confuse with pre-auth keys used by Tailscale clients:
 *   - API key (v0.28+):  hskey-api-{prefix}-{secret}
 *   - API key (legacy):  {prefix}.{secret}
 *   - Pre-auth key:      hskey-auth-{prefix}-{secret}
 *   - Registration key:  hskey-reg-{random}
 *
 * @see https://github.com/juanfont/headscale/releases/tag/v0.28.0
 */

export type ApiKeyKind =
  | "api-v028"
  | "api-legacy"
  | "preauth"
  | "registration"
  | "unknown";

/** Strip whitespace and an accidental "Bearer " prefix from a pasted key. */
export function normalizeApiKey(raw: string): string {
  let key = (raw ?? "").trim();
  if (/^bearer\s+/i.test(key)) {
    key = key.replace(/^bearer\s+/i, "").trim();
  }
  // Remove any remaining whitespace/newlines from paste
  return key.replace(/\s+/g, "");
}

/** Classify a pasted token so we can reject pre-auth keys used as API keys. */
export function getApiKeyKind(key: string): ApiKeyKind {
  const normalized = normalizeApiKey(key);
  if (normalized.startsWith("hskey-api-")) return "api-v028";
  if (normalized.startsWith("hskey-auth-")) return "preauth";
  if (normalized.startsWith("hskey-reg-")) return "registration";
  // Legacy Headscale API keys: 7-char prefix + "." + secret
  if (/^[A-Za-z0-9_-]{7}\.[A-Za-z0-9_-]+$/.test(normalized)) return "api-legacy";
  return "unknown";
}

export function isUsableApiKey(key: string): boolean {
  const kind = getApiKeyKind(key);
  return kind === "api-v028" || kind === "api-legacy" || kind === "unknown";
}

/**
 * Headscale v0.28 lists API key prefixes masked, e.g. `hskey-api-AbCdEfGhIjKl-***`.
 * Match a full key against that listed prefix (asterisks stripped).
 */
export function apiKeyMatchesListedPrefix(
  fullKey: string,
  listedPrefix: string | undefined | null,
): boolean {
  if (!listedPrefix) return false;
  const key = normalizeApiKey(fullKey);
  const unmasked = listedPrefix.replace(/\*/g, "");
  return key.startsWith(unmasked);
}

/** Prefer numeric id for expire/delete on v0.28+; fall back to listed prefix. */
export function buildExpireApiKeyBody(key: {
  id?: number | string;
  prefix?: string;
}): { id: number } | { prefix: string } {
  if (key.id !== undefined && key.id !== null && key.id !== "") {
    const id = typeof key.id === "string" ? Number(key.id) : key.id;
    if (Number.isFinite(id) && id > 0) {
      return { id };
    }
  }
  if (!key.prefix) {
    throw new Error("API key expire requires id or prefix");
  }
  return { prefix: key.prefix };
}
