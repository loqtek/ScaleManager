import { getServerConfig } from "../utils/getServer";
  
export async function getUsers() {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;

      const response = await fetch(`${server}/api/v1/user`, {
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

// Not useful
export async function getUserInfo(userName: string) {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;

      const response = await fetch(`${server}/api/v1/user/${userName}`, {
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

export async function addUser(userName: string) {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;

      const response = await fetch(`${server}/api/v1/user`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({
          name: userName,
        }),
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

export async function deleteUser(userName: string) {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;

      const response = await fetch(`${server}/api/v1/user/${userName}`, {
        method: 'DELETE',
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
    }
    catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}

export async function renameUser(oldName: string, newName: string) {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;
      
      const response = await fetch(`${server}/api/v1/user/${oldName}/rename/${newName}`, {
        method: 'POST',
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
    }
    catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
}