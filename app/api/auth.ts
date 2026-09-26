import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

/** Approve a pending auth request (SSH check or web auth). v0.29+ */
export async function approveAuth(authId: string) {
  const config = await getApiEndpoints();
  if (!config?.endpoints.auth) {
    return {
      error: true,
      message: "Auth approve requires Headscale v0.29+",
    };
  }

  const apiCall = config.endpoints.auth.approve(authId.trim());
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

/** Reject a pending auth request. v0.29+ */
export async function rejectAuth(authId: string) {
  const config = await getApiEndpoints();
  if (!config?.endpoints.auth) {
    return {
      error: true,
      message: "Auth reject requires Headscale v0.29+",
    };
  }

  const apiCall = config.endpoints.auth.reject(authId.trim());
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}
