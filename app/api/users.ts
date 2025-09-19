import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils"


export async function getUsers() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  return await makeApiRequest(endpoints.users.get);
}

// Not useful - keeping for backward compatibility
export async function getUserInfo(userName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  // This endpoint doesn't exist in the current API mapping
  // but keeping the function for backward compatibility
  return await makeApiRequest(`/api/v1/user/${userName}`);
}

export async function addUser(userName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const apiCall = endpoints.users.addUser(userName);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

export async function deleteUser(userName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  
  // Note: The API expects user ID, but we're receiving userName
  // This might need adjustment based on your actual implementation
  const apiCall = endpoints.users.deleteUser(userName as any); // Type assertion for now
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function renameUser(oldName: string, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const apiCall = endpoints.users.renameUser(oldName, newName);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}