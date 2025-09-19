import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

export async function getDevices() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  return await makeApiRequest(endpoints.devices.get, { method: 'GET' });
}

export async function registerDevice(user: string, key: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  // Convert user string to number if needed
  const userParam = isNaN(Number(user)) ? user : Number(user);
  const apiCall = endpoints.devices.registerDevice(userParam as number, key);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function renameDevice(id: string, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  const apiCall = endpoints.devices.renameDevice(deviceId as number, newName);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function deleteDevice(id: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  const apiCall = endpoints.devices.deleteDevice(deviceId as number);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function addTags(id: string, tags: string[]) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  
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

export async function changeUser(id: string, user: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  const apiCall = endpoints.devices.changeUser(deviceId as number, user);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}