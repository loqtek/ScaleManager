import { getServerConfig } from "../utils/getServer";
import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

export async function getACLPolicy() {
  try {
    const config = await getApiEndpoints();
    if (!config) return null;

    const { endpoints } = config;
    const response = await makeApiRequest(endpoints.acl.getPolicy, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error("Fetch ACL policy error:", error);
    return null;
  }
}

export async function updateACLPolicy(policy: any) {
  try {
    const config = await getApiEndpoints();
    if (!config) return null;

    const { endpoints, serverConf } = config;
    
    const policyString = typeof policy === 'string' ? policy : JSON.stringify(policy);
    
    const requestBody = JSON.stringify({
      policy: policyString
    });
        
    const updateConfig = endpoints.acl.updatePolicy(policy);
    
    const response = await makeApiRequest(updateConfig.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serverConf.apiKey}`,
      },
      body: requestBody,
    });

    return response;
  } catch (error) {
    console.error("Update ACL policy error:", error);
    throw error;
  }
}