
export interface ServerConfig {
  main: string;
  server: string;
  apikey: string;
  addedOn: string;
  version: string;
}

export interface ApiEndpoints {
  routes: {
    list: string;
    update: (id: string, enabledOrRoutes: any) => { url: string; method: string; body?: any };
  };
  // Add other endpoint categories as needed
}

export const API_VERSION_MAP: Record<string, ApiEndpoints> = {
  'v0.23': {
    routes: {
      list: '/api/v1/routes',
      update: (id: string, enabled: boolean) => ({
        url: enabled ? `/api/v1/routes/${id}/enable` : `/api/v1/routes/${id}/disable`,
        method: 'POST',
      }),
    },
  },
  //'v0.24': {
  //},
  //'v0.25': {
  //},
  'v0.26': {
    routes: {
      list: '/api/v1/route',
      update: (id: string, routes) => ({
        url: `/api/v1/node/${id}/approve_routes`,
        method: 'PUT',
        body: { routes },
      }),
    },
  },
};
