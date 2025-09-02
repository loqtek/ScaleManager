import { getServerConfig } from "../utils/getServer";



export async function getPreAuthKeys(user?: string) {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;

      var url = `${server}/api/v1/preauthkey`;
      if (user) {
        url += `?user=${user}`;
      }
      const response = await fetch(url, {
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


export async function createPreAuthKey(user: string, expiration: string, reusable ?: boolean) {
    try {
      const serverConf = await getServerConfig();
      
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }

      const server = serverConf.server;
      const authKey = serverConf.apiKey;

      const response = await fetch(`${server}/api/v1/preauthkey`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({ user, expiration, reusable }),
      });
      
      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return null;
      }
  
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}

export async function expirePreAuthKey(user: string, key: string) {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;
      
      const response = await fetch(`${server}/api/v1/preauthkey/expire`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({ key, user }),
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
