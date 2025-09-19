
import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils"


export async function getPreAuthKeys(user?: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const apiCall = endpoints.preauthkeys.get(user);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function createPreAuthKey(user: string, expiration: string, reusable: boolean = false) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  // Convert user string to number if needed (some API versions might expect user ID)
  const userParam = isNaN(Number(user)) ? user : Number(user);
  const apiCall = endpoints.preauthkeys.createPreauthKey(userParam as number, expiration, reusable);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

export async function expirePreAuthKey(user: string, key: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  // Convert user string to number if needed
  const userParam = isNaN(Number(user)) ? user : Number(user);
  const apiCall = endpoints.preauthkeys.expirePreauthKey(userParam as number, key);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}