import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";
import { isV026OrHigher } from "../utils/headscaleVersion";

export async function getDevices() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  return await makeApiRequest(endpoints.devices.get, { method: 'GET' });
}

export async function registerDevice(user: string | number, key: string) {
  const config = await getApiEndpoints();
  if (!config) return null;
  const { endpoints } = config;
  const apiCall = endpoints.devices.registerDevice(user as number, key);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: apiCall.body ? JSON.stringify(apiCall.body) : undefined,
  });
}

export async function renameDevice(idOrName: string | number, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  // Check if we're using v0.26 or higher (which uses integer IDs)
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  // Convert to appropriate type based on version
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
  
  // Check if we're using v0.26 or higher (which uses integer IDs)
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  // Convert to appropriate type based on version
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
  
  // Check if we're using v0.26 or higher (which uses integer IDs)
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  // Convert to appropriate type based on version
  const deviceId = usesNumericIds ? Number(idOrName) : idOrName;
  
  // Format tags with "tag:" prefix and normalize
  const formattedTags = tags.map(tag => `tag:${tag.trim().toLowerCase()}`);
  const apiCall = endpoints.devices.addTags(deviceId as number, formattedTags);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

export async function removeTags(id: string, tags: string[]) {
  // TODO: Implement when API endpoint is available
  console.warn("removeTags not yet implemented - API endpoint needed");
  return null;
}

export async function changeUser(idOrName: number, user: any) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  // Check if we're using v0.26 or higher (which uses integer IDs)
  const usesNumericIds = isV026OrHigher(serverConf.version);
  
  // Convert to appropriate types based on version
  const deviceId = usesNumericIds ? Number(idOrName) : idOrName;
  const userId = usesNumericIds ? Number(user.id) : user.name;
  const apiCall = endpoints.devices.changeUser(deviceId as number, userId);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: apiCall.body ? JSON.stringify(apiCall.body) : undefined,
  });
}