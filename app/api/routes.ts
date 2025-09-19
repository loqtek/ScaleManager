import { getServerConfig } from "../utils/getServer";
import { API_VERSION_MAP } from "../config/apiVersions";

export async function getServerRoutes() {
    try {
        const serverConf = await getServerConfig();

        if (!serverConf) {
            console.error("No server configuration found");
            return null;
        }

        const { server, apikey, version } = serverConf;
        const versionKey = version.startsWith("0.26") ? "v0.26" :
                           version.startsWith("0.23") ? "v0.23" :
                           // add more version checks if needed
                           "v0.23"; // fallback

        const api = API_VERSION_MAP[versionKey];

        const url = `${server}${api.routes.list}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${apikey}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            data.status = false;
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

export async function updateRoute(id: string, enabledOrRoutes: any) {
    try {
        const serverConf = await getServerConfig();

        if (!serverConf) {
            console.error("No server configuration found");
            return null;
        }

        const { server, apikey, version } = serverConf;
        const versionKey = version.startsWith("0.26") ? "v0.26" :
                           version.startsWith("0.23") ? "v0.23" :
                           "v0.23"; // fallback

        const api = API_VERSION_MAP[versionKey];
        const { url, method, body } = api.routes.update(id, enabledOrRoutes);

        const response = await fetch(`${server}${url}`, {
            method,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${apikey}`,
                "Content-Type": body ? "application/json" : undefined,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            data.status = false;
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

// Convenience wrappers for old-style enable/disable
export async function enableRoute(id: string) {
    return updateRoute(id, true);
}

export async function disableRoute(id: string) {
    return updateRoute(id, false);
}
