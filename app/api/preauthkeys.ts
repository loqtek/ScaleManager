import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

export async function getPreAuthKeys(userIdentifier?: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  console.log(userIdentifier)
  const apiCall = endpoints.preauthkeys.get(userIdentifier);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function createPreAuthKey(userIdentifier: string, expiration: string, reusable: boolean = false) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  const apiCall = endpoints.preauthkeys.createPreauthKey(userIdentifier, expiration, reusable);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

export async function expirePreAuthKey(userIdentifier: string, key: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  const apiCall = endpoints.preauthkeys.expirePreauthKey(userIdentifier, key);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}