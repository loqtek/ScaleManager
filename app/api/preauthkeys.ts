import { getApiEndpoints, makeApiRequest, isApiSuccess } from "../utils/apiUtils";
import { isV028OrHigher } from "../utils/headscaleVersion";

export async function getPreAuthKeys(userIdentifier?: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const apiCall = endpoints.preauthkeys.get(userIdentifier);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function createPreAuthKey(userIdentifier: string | number, expiration: string, reusable: boolean = false) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  const apiCall = endpoints.preauthkeys.createPreauthKey(userIdentifier, expiration, reusable);
  const rawUser = apiCall.body.user;
  const userValue =
    typeof rawUser === "number"
      ? rawUser
      : /^\d+$/.test(String(rawUser))
        ? Number(rawUser)
        : rawUser;

  const body = {
    ...apiCall.body,
    user: userValue,
  };

  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(body),
  });
}

export async function expirePreAuthKey(userIdentifier: string | number, keyOrId: string, version?: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  // v0.28 switched to ID-based operations.
  const identifier = isV028OrHigher(version || config.serverConf?.version) ? keyOrId : userIdentifier;
  const keyValue = keyOrId;
  const apiCall = endpoints.preauthkeys.expirePreauthKey(identifier, keyValue);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}