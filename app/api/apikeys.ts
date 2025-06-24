import { getServerConfig } from "../utils/getServer";
  
export async function getAPIKeys() {
    try {
      const serverConf = await getServerConfig();

      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = serverConf.apiKey;
      
      const response = await fetch(`${server}/api/v1/apikey`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}


export async function createAPIKey(expiration: string) {
    try {
      const serverConf = await getServerConfig();
      
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = serverConf.apiKey;
      
      const response = await fetch(`${server}/api/v1/apikey`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({ expiration }),
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}

export async function expireAPIKey(prefix: string) {
    try {
      const serverConf = await getServerConfig();
      
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = serverConf.apiKey;
      
      const response = await fetch(`${server}/api/v1/apikey/expire`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({ prefix }),
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}

