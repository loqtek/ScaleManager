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

    const { endpoints } = config;

    const policyString = typeof policy === 'string' ? policy : JSON.stringify(policy);

    const requestBody = JSON.stringify({
      policy: policyString
    });

    const updateConfig = endpoints.acl.updatePolicy(policy);

    const response = await makeApiRequest(updateConfig.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    return response;
  } catch (error) {
    console.error("Update ACL policy error:", error);
    throw error;
  }
}

/**
 * Validate a policy without applying it (v0.29+).
 * Runs ACL/grants/ssh tests when present; returns server error payload on failure.
 */
export async function checkACLPolicy(policy: any) {
  try {
    const config = await getApiEndpoints();
    if (!config) return null;

    const check = config.endpoints.acl.checkPolicy;
    if (!check) {
      return { skipped: true };
    }

    const policyString = typeof policy === 'string' ? policy : JSON.stringify(policy);
    const apiCall = check(policyString);

    return await makeApiRequest(apiCall.url, {
      method: apiCall.method,
      body: JSON.stringify(apiCall.body),
    });
  } catch (error) {
    console.error("Check ACL policy error:", error);
    throw error;
  }
}
