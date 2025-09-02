import { getServerConfig } from "../utils/getServer";
  
export async function getDevices() {
    try {
      const serverConf = await getServerConfig();
    
      if (!serverConf) {
        console.error("No server configuration found");
        return null;
      }
  
      const server = serverConf.server;
      const authKey = serverConf.apiKey;
      
      const response = await fetch(`${server}/api/v1/node`, {
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

export async function registerDevice(user: string, key: string) {
  try {
    const serverConf = await getServerConfig();
    
    if (!serverConf) {
      console.error("No server configuration found");
      return null;
    }

    const server = serverConf.server;
    const authKey = serverConf.apiKey;

    const response = await fetch(`${server}/api/v1/node/register?user=${user}&key=${key}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authKey}`,
        'Content-Type': 'application/json',
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

export async function renameDevice(id: string, newName: string) {
  try {
    const serverConf = await getServerConfig();
    
    if (!serverConf) {
      console.error("No server configuration found");
      return null;
    }

    const server = serverConf.server;
    const authKey = serverConf.apiKey;

    const response = await fetch(`${server}/api/v1/node/${id}/rename/${newName}`, {
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

export async function deleteDevice(id: string) {
  try {
    const serverConf = await getServerConfig();
    
    if (!serverConf) {
      console.error("No server configuration found");
      return null;
    }

    const server = serverConf.server;
    const authKey = serverConf.apiKey;

    const response = await fetch(`${server}/api/v1/node/${id}`, {
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

export async function addTags(id: string, tags: string[]) {
  try {
    const serverConf = await getServerConfig();
    
    if (!serverConf) {
      console.error("No server configuration found");
      return null;
    }

    const server = serverConf.server;
    const authKey = serverConf.apiKey;

    const formattedTags = tags.map(tag => `tag:${tag.trim().toLowerCase()}`);

    const response = await fetch(`${server}/api/v1/node/${id}/tags`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: formattedTags }),
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



export async function removeTags(id: string, tags: string[]) {
  
}

export async function changeUser(id: string, user: string) {
  try {
    const serverConf = await getServerConfig();
    
    if (!serverConf) {
      console.error("No server configuration found");
      return null;
    }

    const server = serverConf.server;
    const authKey = serverConf.apiKey;

    const response = await fetch(`${server}/api/v1/node/${id}/user?user=${user}`, {
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