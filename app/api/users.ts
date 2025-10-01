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

export async function deleteUser(userNameOrId: string | number) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
    
  const apiCall = endpoints.users.deleteUser(userNameOrId);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function renameUser(oldNameOrId: string | number, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints, serverConf } = config;
    
  const apiCall = endpoints.users.renameUser(oldNameOrId, newName);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}