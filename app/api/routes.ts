import { getServerConfig } from "../utils/getServer";



export async function getServerRoutes() {
    try {
        const serverConf = await getServerConfig();

        if (!serverConf) {
            console.error("No server configuration found");
            return null;
        }

        const server = serverConf.server;
        const authKey = serverConf.apiKey;

        var url = `${server}/api/v1/routes`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authKey}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            data.status = false;
            return data;
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

export async function disableRoute(id: string) {
    try {
        const serverConf = await getServerConfig();

        if (!serverConf) {
            console.error("No server configuration found");
            return null;
        }

        const server = serverConf.server;
        const authKey = serverConf.apiKey;

        var url = `${server}/api/v1/routes/${id}/disable`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authKey}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            data.status = false;
            return data;
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

export async function enableRoute(id: string) {
    try {
        const serverConf = await getServerConfig();

        if (!serverConf) {
            console.error("No server configuration found");
            return null;
        }

        const server = serverConf.server;
        const authKey = serverConf.apiKey;

        var url = `${server}/api/v1/routes/${id}/enable`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authKey}`,
            },
        });
        const data = await response.json();

        if (!response.ok) {
            data.status = false;
            return data;
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}