import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

export async function getDevices() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  return await makeApiRequest(endpoints.devices.get, { method: 'GET' });
}

export async function registerDevice(user: string | number, key: string) {
  const config = await getApiEndpoints();
  if (!config) return null;
      
  // Use query parameters for both versions
  const url = `/api/v1/node/register?user=${user}&key=${key}`;
  
  return await makeApiRequest(url, {
    method: 'POST',
  });
}

export async function renameDevice(idOrName: string | number, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  // Check if we're using v0.26 or higher (which uses integer IDs)
  const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
  const isV026OrHigher = versionKey >= 'v0.26';
  
  // Convert to appropriate type based on version
  const deviceId = isV026OrHigher ? Number(idOrName) : idOrName;
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
  const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
  const isV026OrHigher = versionKey >= 'v0.26';
  
  // Convert to appropriate type based on version
  const deviceId = isV026OrHigher ? Number(id) : id;
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
  const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
  const isV026OrHigher = versionKey >= 'v0.26';
  
  // Convert to appropriate type based on version
  const deviceId = isV026OrHigher ? Number(idOrName) : idOrName;
  
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

export async function changeUser(idOrName: number, user: string | number) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
  
  // Check if we're using v0.26 or higher (which uses integer IDs)
  const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
  const isV026OrHigher = versionKey >= 'v0.26';
  
  // Convert to appropriate types based on version
  const deviceId = isV026OrHigher ? Number(idOrName) : idOrName;
  const userId = isV026OrHigher ? Number(user.id) : user.name;
  const apiCall = endpoints.devices.changeUser(deviceId as number, userId);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: apiCall.body ? JSON.stringify(apiCall.body) : undefined,
  });
}