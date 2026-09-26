import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";
import { isV026OrHigher, isV029OrHigher } from "../utils/headscaleVersion";

export async function getDevices() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  return await makeApiRequest(endpoints.devices.get, { method: 'GET' });
}

/**
 * Register a device.
 * - v0.29+: POST /api/v1/auth/register JSON { user, authId }  (user = username)
 * - v0.28-: POST /api/v1/node/register?user=<name>&key=<id>  (query params, not JSON body)
 *
 * Headscale looks up the user by *name* (GetUserByName), not numeric ID.
 */
export async function registerDevice(user: string | number, keyOrAuthId: string) {
  const config = await getApiEndpoints();
  if (!config) return null;
  const { endpoints, serverConf } = config;

  // Always pass username — Headscale RegisterNode uses GetUserByName().
  const userName = String(user);

  if (isV029OrHigher(serverConf.version)) {
    const apiCall = endpoints.devices.registerDevice(userName, keyOrAuthId);
    return await makeApiRequest(apiCall.url, {
      method: apiCall.method,
      body: JSON.stringify(apiCall.body ?? { user: userName, authId: keyOrAuthId }),
    });
  }

  // v0.28 and older: grpc-gateway binds RegisterNode fields as query parameters.
  const params = new URLSearchParams({
    user: userName,
    key: keyOrAuthId,
  });

  return await makeApiRequest(`/api/v1/node/register?${params.toString()}`, {
    method: 'POST',
  });
}

export async function renameDevice(idOrName: string | number, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  const deviceId = usesNumericIds ? Number(idOrName) : idOrName;
  const apiCall = endpoints.devices.renameDevice(deviceId as number, newName);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function deleteDevice(id: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  const deviceId = usesNumericIds ? Number(id) : id;
  const apiCall = endpoints.devices.deleteDevice(deviceId as number);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function addTags(idOrName: string | number, tags: string[]) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  const deviceId = usesNumericIds ? Number(idOrName) : idOrName;
  
  const formattedTags = tags.map(tag => `tag:${tag.trim().toLowerCase()}`);
  const apiCall = endpoints.devices.addTags(deviceId as number, formattedTags);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

export async function removeTags(id: string, tags: string[]) {
  console.warn("removeTags not yet implemented - API endpoint needed");
  return null;
}

export async function changeUser(idOrName: number, user: any) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  const deviceId = usesNumericIds ? Number(idOrName) : idOrName;
  const userId = usesNumericIds ? Number(user.id) : user.name;
  const apiCall = endpoints.devices.changeUser(deviceId as number, userId);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: apiCall.body ? JSON.stringify(apiCall.body) : undefined,
  });
}
