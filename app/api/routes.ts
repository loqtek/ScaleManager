import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

export async function getServerRoutes() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  try {
    const data = await makeApiRequest(endpoints.routes.get, { method: 'GET' });
    return data;
  } catch (error) {
    console.error("Failed to fetch routes:", error);
    return null;
  }
}

export async function updateRoute(id: string, enabled: boolean) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  try {
    const apiCall = endpoints.routes.update(id, enabled);
    
    const requestOptions: RequestInit = {
      method: apiCall.method,
    };

    // Add body if provided by the API call
    if (apiCall.body) {
      requestOptions.body = JSON.stringify(apiCall.body);
    }

    const data = await makeApiRequest(apiCall.url, requestOptions);
    return data;
  } catch (error) {
    console.error("Failed to update route:", error);
    return null;
  }
}

// Convenience wrappers for old-style enable/disable
export async function enableRoute(id: string) {
  return updateRoute(id, true);
}

export async function disableRoute(id: string) {
  return updateRoute(id, false);
}