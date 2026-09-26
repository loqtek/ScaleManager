import { getServerConfig } from "../utils/getServer";
import { buildExpireApiKeyBody, normalizeApiKey } from "../utils/apiKeyUtils";
import { fetchWithFallback } from "../utils/apiUtils";
  
export async function getAPIKeys() {
    try {
      const serverConf = await getServerConfig();

      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = normalizeApiKey(serverConf.apiKey);
      
      const response = await fetchWithFallback(server, authKey, `/api/v1/apikey`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}


export async function createAPIKey(expiration: string) {
    try {
      const serverConf = await getServerConfig();
      
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = normalizeApiKey(serverConf.apiKey);
      
      const response = await fetchWithFallback(server, authKey, `/api/v1/apikey`, {
        method: 'POST',
        body: JSON.stringify({ expiration }),
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}

/** Expire an API key by id (preferred on v0.28+) or listed prefix. */
export async function expireAPIKey(key: { id?: number | string; prefix?: string }) {
    try {
      const serverConf = await getServerConfig();
      
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = normalizeApiKey(serverConf.apiKey);
      const body = buildExpireApiKeyBody(key);
      
      const response = await fetchWithFallback(server, authKey, `/api/v1/apikey/expire`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}
