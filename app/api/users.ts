import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils"


export async function getUsers() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const res = await makeApiRequest(endpoints.users.get); 
  console.log(res)
  return {
   "users":[
      {
         "createdAt":"2024-11-10T01:47:51.355254176Z",
         "displayName":"",
         "email":"",
         "id":"2",
         "name":"example-iot",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2024-11-10T01:48:10.328159447Z",
         "displayName":"",
         "email":"",
         "id":"3",
         "name":"example-laptop",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2024-11-10T01:48:15.731355130Z",
         "displayName":"",
         "email":"",
         "id":"4",
         "name":"example-desktop",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2024-11-10T01:48:53.914980651Z",
         "displayName":"",
         "email":"",
         "id":"5",
         "name":"example-phone",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2024-11-10T01:49:44.303782378Z",
         "displayName":"",
         "email":"",
         "id":"7",
         "name":"example-exitnode",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2024-11-10T01:49:51.352439623Z",
         "displayName":"",
         "email":"",
         "id":"8",
         "name":"example-services",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2024-11-10T01:50:15.436832143Z",
         "displayName":"",
         "email":"",
         "id":"9",
         "name":"example-guests",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2025-01-05T20:41:06.139323129Z",
         "displayName":"",
         "email":"",
         "id":"10",
         "name":"example-gw",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      },
      {
         "createdAt":"2025-04-10T01:56:34.463672921Z",
         "displayName":"",
         "email":"",
         "id":"11",
         "name":"example-otherphones",
         "profilePicUrl":"",
         "provider":"",
         "providerId":""
      }
   ]
}
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