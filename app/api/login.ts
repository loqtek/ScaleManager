import { fetchWithFallback } from "../utils/apiUtils";
import {
  getApiKeyKind,
  isUsableApiKey,
  normalizeApiKey,
} from "../utils/apiKeyUtils";

export type ApiKeyTestResult = {
  ok: boolean;
  /** Short user-facing reason when ok is false */
  message?: string;
  status?: number;
};

export async function testAPIKey(
  server: string,
  apiKey: string,
): Promise<boolean> {
  const result = await testAPIKeyDetailed(server, apiKey);
  return result.ok;
}

export async function testAPIKeyDetailed(
  server: string,
  apiKey: string,
): Promise<ApiKeyTestResult> {
  const key = normalizeApiKey(apiKey);

  if (!key) {
    return { ok: false, message: "API key is empty." };
  }

  const kind = getApiKeyKind(key);
  if (kind === "preauth") {
    return {
      ok: false,
      message:
        "That looks like a pre-auth key (hskey-auth-…), not an API key. Create an API key with: headscale apikeys create",
    };
  }
  if (kind === "registration") {
    return {
      ok: false,
      message:
        "That looks like a registration key (hskey-reg-…), not an API key. Use a management API key (hskey-api-…).",
    };
  }
  if (!isUsableApiKey(key)) {
    return {
      ok: false,
      message:
        "Unrecognized key format. Headscale v0.28+ API keys look like hskey-api-{prefix}-{secret}.",
    };
  }

  try {
    // Uses the fallback-aware fetch so a singular/plural endpoint mismatch
    // (which returns 404) doesn't get misreported as an invalid API key.
    const response = await fetchWithFallback(server, key, "/api/v1/apikey", {
      method: "GET",
    });

    if (response.ok) {
      return { ok: true };
    }

    const body = await response.text();
    console.error("API Error:", response.status, body);

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        status: response.status,
        message:
          kind === "api-legacy"
            ? "API key rejected. If this server is Headscale v0.28+, create a new key with: headscale apikeys create"
            : "API key rejected by the server. Confirm you pasted the full hskey-api-… key.",
      };
    }

    if (response.status === 404) {
      return {
        ok: false,
        status: response.status,
        message: "Could not reach the Headscale API (404). Check the server URL.",
      };
    }

    return {
      ok: false,
      status: response.status,
      message: `Server returned ${response.status}. Check URL and API key.`,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      ok: false,
      message:
        "Could not reach the server. Check the URL, HTTPS/HTTP, and network connectivity.",
    };
  }
}
