import { getServerConfig } from "../utils/getServer";
import { API_VERSION_MAP, ApiEndpoints } from "../config/apiVersions";
import { normalizeApiKey } from "./apiKeyUtils";
import { getVersionKey } from "./headscaleVersion";

// Headscale's REST API uses singular resource names (e.g. /api/v1/node), but
// different releases and forks have shipped both singular and plural variants.
// To stay compatible across versions we treat these as interchangeable and,
// when a request 404s on one spelling, transparently retry the other.
const ENDPOINT_ALIASES: Record<string, string> = {
  node: "nodes",
  nodes: "node",
  user: "users",
  users: "user",
  apikey: "apikeys",
  apikeys: "apikey",
  preauthkey: "preauthkeys",
  preauthkeys: "preauthkey",
  route: "routes",
  routes: "route",
  health: "healthz",
  healthz: "health",
};

// Returns the request path plus any alternate spellings of its resource
// segment, primary spelling first. Query strings and sub-paths are preserved.
export function buildEndpointCandidates(path: string): string[] {
  // Match the resource segment directly after /api/v1/.
  const apiMatch = path.match(/^(\/api\/v1\/)([^/?]+)(.*)$/);
  if (apiMatch) {
    const [, prefix, resource, rest] = apiMatch;
    const alias = ENDPOINT_ALIASES[resource];
    if (alias) return [path, `${prefix}${alias}${rest}`];
    return [path];
  }

  // Non-versioned health endpoint (/health <-> /healthz).
  const healthMatch = path.match(/^(\/)(health|healthz)(.*)$/);
  if (healthMatch) {
    const [, prefix, resource, rest] = healthMatch;
    const alias = ENDPOINT_ALIASES[resource];
    if (alias) return [path, `${prefix}${alias}${rest}`];
  }

  return [path];
}

// Performs a fetch that tolerates singular/plural endpoint differences.
// If the primary spelling returns 404 (endpoint not found), the alternate
// spelling is tried before giving up. A 401/403 (bad key) short-circuits so we
// never mask an auth failure by probing other paths.
export async function fetchWithFallback(
  server: string,
  apiKey: string,
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const candidates = buildEndpointCandidates(path);
  let lastResponse: Response | null = null;

  const token = normalizeApiKey(apiKey);

  for (const candidate of candidates) {
    const response = await fetch(`${server}${candidate}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
        // Always win over caller headers so we never drop the Bearer scheme
        // required by Headscale (missing "Bearer " is logged as an auth error).
        Authorization: `Bearer ${token}`,
      },
    });

    // A real auth failure is definitive; don't keep probing other paths.
    if (response.status === 401 || response.status === 403) {
      return response;
    }

    // Only a missing endpoint (404) is worth retrying with the alternate name.
    if (response.status !== 404) {
      return response;
    }

    lastResponse = response;
  }

  return lastResponse as Response;
}

// Helper function to get the correct API endpoints based on server version
export async function getApiEndpoints(): Promise<{ endpoints: ApiEndpoints; serverConf: any } | null> {
  const serverConf = await getServerConfig();
  
  if (!serverConf) {
    console.error("No server configuration found");
    return null;
  }

  // Map version to API version key
  const versionKey = getVersionKey(serverConf.version);

  const endpoints = API_VERSION_MAP[versionKey];
  if (!endpoints) {
    console.warn(`No API endpoints found for version ${versionKey}, using default v0.26`);
    return { endpoints: API_VERSION_MAP['v0.26'], serverConf };
  }

  return { endpoints, serverConf };
}

// Helper function to make API requests
export async function makeApiRequest(url: string, options: RequestInit = {}) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { serverConf } = config;

  try {
    const response = await fetchWithFallback(serverConf.server, serverConf.apiKey, url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      
      // Try to parse error response as JSON
      try {
        const errorData = JSON.parse(errorText);
        return errorData; // Return the error data instead of null
      } catch (error) {
        console.error(error)
        // If parsing fails, return a generic error object
        return {
          code: response.status,
          message: errorText,
          error: true
        };
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}