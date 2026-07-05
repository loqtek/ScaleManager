import { fetchWithFallback } from "../utils/apiUtils";

export async function testAPIKey(server: string, apiKey: string): Promise<boolean> {
    try {
      // Uses the fallback-aware fetch so a singular/plural endpoint mismatch
      // (which returns 404) doesn't get misreported as an invalid API key.
      const response = await fetchWithFallback(server, apiKey, "/api/v1/apikey", {
        method: "GET",
      });

      if (response.ok) {
        return true;
      }

      // 401/403 means the key really is invalid; anything else (e.g. a 404 on
      // both endpoint spellings, or a 5xx) is logged so it isn't silently
      // treated as an auth problem.
      console.error("API Error:", response.status, await response.text());
      return false;
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
}
  





