export interface ApiEndpoints {
  apikeys: {
    get: string;
    createApiKey: (expiration: string) => { url: string; method: string; body?: any };
    expireApiKey: (prefix: string) => { url: string; method: string; body?: any };
  };

  devices: {
    get: string;
    registerDevice: (user: number, key: string) => { url: string; method: string };
    renameDevice: (id: number, newName: string) => { url: string; method: string };
    deleteDevice: (id: number) => { url: string; method: string };
    addTags: (id: number, tags: string[]) => { url: string; method: string; body?: any };
    changeUser: (id: number, user: string) => { url: string; method: string };
  };

  preauthkeys: {
    get: (userId?: string) => { url: string; method: string };
    createPreauthKey: (user: number, expiration: string, reusable: boolean) => { 
      url: string; 
      method: string; 
      body: { user: number; expiration: string; reusable: boolean }; 
    };
    expirePreauthKey: (user: number, key: string) => { 
      url: string; 
      method: string; 
      body: { user: number; key: string }; 
    };
  };

  routes: {
    get: string;
    update: (id: string, enabledOrRoutes: any) => { url: string; method: string; body?: any };
  };

  users: {
    get: string;
    addUser: (name: string) => { url: string; method: string; body?: any };
    deleteUser: (nameOrId: string | number) => { url: string; method: string; body?: any };
    renameUser: (oldName: string, newName: string) => { url: string; method: string; body?: any };
  };
}

export const API_VERSION_MAP: Record<string, ApiEndpoints> = {
  'v0.23': {
    apikeys: {
      get: '/api/v1/apikey',
      createApiKey: (expiration: string) => ({
        url: `/api/v1/apikey`,
        method: 'POST',
        body: { expiration }
      }),
      expireApiKey: (prefix: string) => ({
        url: `/api/v1/apikey/expire`,
        method: 'POST',
        body: { prefix }
      }),
    },

    devices: {
      get: '/api/v1/node',
      registerDevice: (user: number, key: string) => ({
        url: `/api/v1/node/register?user=${user}&key=${key}`,
        method: 'POST',
      }),
      renameDevice: (id: number, newName: string) => ({
        url: `/api/v1/node/${id}/rename/${newName}`,
        method: 'POST',
      }),
      deleteDevice: (id: number) => ({
        url: `/api/v1/node/${id}`,
        method: 'DELETE',
      }),
      addTags: (id: number, tags: string[]) => ({
        url: `/api/v1/node/${id}/tags`,
        method: 'POST',
        body: { tags }
      }),
      changeUser: (id: number, user: string) => ({
        url: `/api/v1/node/${id}/user?user=${user}`,
        method: 'POST',
      }),
    },

    preauthkeys: {
      get: (userId?: string) => ({
        url: userId ? `/api/v1/preauthkey?user=${userId}` : `/api/v1/preauthkey`,
        method: 'GET',
      }),
      createPreauthKey: (user: number, expiration: string, reusable: boolean) => ({
        url: `/api/v1/preauthkey`,
        method: 'POST',
        body: { user, expiration, reusable },
      }),
      expirePreauthKey: (user: number, key: string) => ({
        url: `/api/v1/preauthkey/expire`,
        method: 'POST',
        body: { user, key },
      }),
    },

    routes: {
      get: '/api/v1/routes',
      update: (id: string, enabled: boolean) => ({
        url: enabled ? `/api/v1/routes/${id}/enable` : `/api/v1/routes/${id}/disable`,
        method: 'POST',
      }),
    },

    users: {
      get: '/api/v1/user', // Fixed: was incorrectly '/api/v1/routes'
      addUser: (name: string) => ({
        url: `/api/v1/user`,
        method: 'POST',
        body: { name }
      }),
      deleteUser: (nameOrId: string | number) => ({
        url: `/api/v1/user/${nameOrId}`,
        method: 'DELETE',
      }),
      renameUser: (oldName: string, newName: string) => ({
        url: `/api/v1/user/${oldName}/rename/${newName}`,
        method: 'POST',
      }),
    },
  },

  'v0.24': {
    // Copy v0.23 for now - adjust if API changes exist
    apikeys: {
      get: '/api/v1/apikey',
      createApiKey: (expiration: string) => ({
        url: `/api/v1/apikey`,
        method: 'POST',
        body: { expiration }
      }),
      expireApiKey: (prefix: string) => ({
        url: `/api/v1/apikey/expire`,
        method: 'POST',
        body: { prefix }
      }),
    },

    devices: {
      get: '/api/v1/node',
      registerDevice: (user: number, key: string) => ({
        url: `/api/v1/node/register?user=${user}&key=${key}`,
        method: 'POST',
      }),
      renameDevice: (id: number, newName: string) => ({
        url: `/api/v1/node/${id}/rename/${newName}`,
        method: 'POST',
      }),
      deleteDevice: (id: number) => ({
        url: `/api/v1/node/${id}`,
        method: 'DELETE',
      }),
      addTags: (id: number, tags: string[]) => ({
        url: `/api/v1/node/${id}/tags`,
        method: 'POST',
        body: { tags }
      }),
      changeUser: (id: number, user: string) => ({
        url: `/api/v1/node/${id}/user?user=${user}`,
        method: 'POST',
      }),
    },

    preauthkeys: {
      get: (userId?: string) => ({
        url: userId ? `/api/v1/preauthkey?user=${userId}` : `/api/v1/preauthkey`,
        method: 'GET',
      }),
      createPreauthKey: (user: number, expiration: string, reusable: boolean) => ({
        url: `/api/v1/preauthkey`,
        method: 'POST',
        body: { user, expiration, reusable },
      }),
      expirePreauthKey: (user: number, key: string) => ({
        url: `/api/v1/preauthkey/expire`,
        method: 'POST',
        body: { user, key },
      }),
    },

    routes: {
      get: '/api/v1/routes',
      update: (id: string, enabled: boolean) => ({
        url: enabled ? `/api/v1/routes/${id}/enable` : `/api/v1/routes/${id}/disable`,
        method: 'POST',
      }),
    },

    users: {
      get: '/api/v1/user',
      addUser: (name: string) => ({
        url: `/api/v1/user`,
        method: 'POST',
        body: { name }
      }),
      deleteUser: (nameOrId: string | number) => ({
        url: `/api/v1/user/${nameOrId}`,
        method: 'DELETE',
      }),
      renameUser: (oldName: string, newName: string) => ({
        url: `/api/v1/user/${oldName}/rename/${newName}`,
        method: 'POST',
      }),
    },
  },

  'v0.25': {
    // Copy v0.24 for now - adjust if API changes exist
    apikeys: {
      get: '/api/v1/apikey',
      createApiKey: (expiration: string) => ({
        url: `/api/v1/apikey`,
        method: 'POST',
        body: { expiration }
      }),
      expireApiKey: (prefix: string) => ({
        url: `/api/v1/apikey/expire`,
        method: 'POST',
        body: { prefix }
      }),
    },

    devices: {
      get: '/api/v1/node',
      registerDevice: (user: number, key: string) => ({
        url: `/api/v1/node/register?user=${user}&key=${key}`,
        method: 'POST',
      }),
      renameDevice: (id: number, newName: string) => ({
        url: `/api/v1/node/${id}/rename/${newName}`,
        method: 'POST',
      }),
      deleteDevice: (id: number) => ({
        url: `/api/v1/node/${id}`,
        method: 'DELETE',
      }),
      addTags: (id: number, tags: string[]) => ({
        url: `/api/v1/node/${id}/tags`,
        method: 'POST',
        body: { tags }
      }),
      changeUser: (id: number, user: string) => ({
        url: `/api/v1/node/${id}/user?user=${user}`,
        method: 'POST',
      }),
    },

    preauthkeys: {
      get: (userId?: string) => ({
        url: userId ? `/api/v1/preauthkey?user=${userId}` : `/api/v1/preauthkey`,
        method: 'GET',
      }),
      createPreauthKey: (user: number, expiration: string, reusable: boolean) => ({
        url: `/api/v1/preauthkey`,
        method: 'POST',
        body: { user, expiration, reusable },
      }),
      expirePreauthKey: (user: number, key: string) => ({
        url: `/api/v1/preauthkey/expire`,
        method: 'POST',
        body: { user, key },
      }),
    },

    routes: {
      get: '/api/v1/routes',
      update: (id: string, enabled: boolean) => ({
        url: enabled ? `/api/v1/routes/${id}/enable` : `/api/v1/routes/${id}/disable`,
        method: 'POST',
      }),
    },

    users: {
      get: '/api/v1/user',
      addUser: (name: string) => ({
        url: `/api/v1/user`,
        method: 'POST',
        body: { name }
      }),
      deleteUser: (nameOrId: string | number) => ({
        url: `/api/v1/user/${nameOrId}`,
        method: 'DELETE',
      }),
      renameUser: (oldName: string, newName: string) => ({
        url: `/api/v1/user/${oldName}/rename/${newName}`,
        method: 'POST',
      }),
    },
  },

  'v0.26': {
    apikeys: {
      get: '/api/v1/apikey',
      createApiKey: (expiration: string) => ({
        url: `/api/v1/apikey`,
        method: 'POST',
        body: { expiration }
      }),
      expireApiKey: (prefix: string) => ({
        url: `/api/v1/apikey/expire`,
        method: 'POST',
        body: { prefix }
      }),
    },
    
    devices: {
      get: '/api/v1/node',
      registerDevice: (user: number, key: string) => ({
        url: `/api/v1/node/register?user=${user}&key=${key}`,
        method: 'POST',
      }),
      renameDevice: (id: number, newName: string) => ({
        url: `/api/v1/node/${id}/rename/${newName}`,
        method: 'POST',
      }),
      deleteDevice: (id: number) => ({
        url: `/api/v1/node/${id}`,
        method: 'DELETE',
      }),
      addTags: (id: number, tags: string[]) => ({
        url: `/api/v1/node/${id}/tags`,
        method: 'POST',
        body: { tags }
      }),
      changeUser: (id: number, user: string) => ({
        url: `/api/v1/node/${id}/user?user=${user}`,
        method: 'POST',
      }),
    },

    preauthkeys: {
      get: (userId?: string) => ({
        url: userId ? `/api/v1/preauthkey?user=${userId}` : `/api/v1/preauthkey`,
        method: 'GET',
      }),
      createPreauthKey: (user: number, expiration: string, reusable: boolean) => ({
        url: `/api/v1/preauthkey`,
        method: 'POST',
        body: { user, expiration, reusable },
      }),
      expirePreauthKey: (user: number, key: string) => ({
        url: `/api/v1/preauthkey/expire`,
        method: 'POST',
        body: { user, key },
      }),
    },

    // v0.26 doesn't have routes - this section can be omitted or kept for compatibility
    routes: {
      get: '/api/v1/routes',
      update: (id: string, routes: string[]) => ({ // enabled: boolean is substituted for the array of routes
        url: `/api/v1/node/${id}/approve_routes`,
        method: 'POST',
        body: { routes }
      }),
    },

    users: {
      get: '/api/v1/user', // Fixed: was incorrectly '/api/v1/routes'
      addUser: (name: string) => ({
        url: `/api/v1/user`,
        method: 'POST',
        body: { name }
      }),
      deleteUser: (nameOrId: string | number) => ({
        url: `/api/v1/user/${nameOrId}`,
        method: 'DELETE',
      }),
      renameUser: (oldName: string, newName: string) => ({
        url: `/api/v1/user/${oldName}/rename/${newName}`,
        method: 'POST',
      }),
    },
  },
};