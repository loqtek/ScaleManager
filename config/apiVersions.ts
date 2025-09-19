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
    enable: (id: string) => string;
    disable: (id: string) => string;
  };
  // Add other endpoint categories as needed
}



export const API_VERSION_MAP: Record<string, ApiEndpoints> = {
  'v0.23': {
    routes: {
      list: '/api/v1/routes',
      enable: (id: string) => `/api/v1/routes/${id}/enable`,
      disable: (id: string) => `/api/v1/routes/${id}/disable`,
    },
  },
    'v0.24': {
    routes: {
      list: '/api/v1/route',
      enable: (id: string) => `/api/v1/route/${id}/enable`,
      disable: (id: string) => `/api/v1/route/${id}/disable`,
    },
  },
  
  'v0.25': {
    routes: {
      list: '/api/v1/route',
      enable: (id: string) => `/api/v1/route/enable/${id}`,
      disable: (id: string) => `/api/v1/route/disable/${id}`,
    },
  },
  'v0.26': {
    routes: {
      list: '/api/v1/route',
      enable: (id: string) => `/api/v1/route/enable/${id}`,
      disable: (id: string) => `/api/v1/route/disable/${id}`,
    },
  },
};