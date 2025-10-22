import { getServerConfig } from "../utils/getServer";
import { API_VERSION_MAP, ApiEndpoints } from "../config/apiVersions";


// Helper function to get the correct API endpoints based on server version
export async function getApiEndpoints(): Promise<{ endpoints: ApiEndpoints; serverConf: any } | null> {
  const serverConf = await getServerConfig();
  
  if (!serverConf) {
    console.error("No server configuration found");
    return null;
  }

  // Map version to API version key
  let versionKey = 'v0.26'; // Default
  if (serverConf.version) {
    // Convert "0.23.x" -> "v0.23", "0.26.x" -> "v0.26", etc.
    versionKey = `v${serverConf.version.split('.').slice(0, 2).join('.')}`;
  }

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
    const response = await fetch(`${serverConf.server}${url}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${serverConf.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

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