export interface Device {
  id: string;
  machineKey: string;
  nodeKey: string;
  discoKey: string;
  ipAddresses: string[];
  name: string;
  user: {
    id: string;
    name: string;
    createdAt: string;
    displayName?: string;
    email?: string;
    provider?: string;
  };
  lastSeen: string;
  expiry: string | null;
  preAuthKey?: {
    user: any;
    id: string;
    key: string;
    reusable: boolean;
    ephemeral: boolean;
    used: boolean;
    expiration: string;
    createdAt: string;
    aclTags: string[];
  } | null;
  createdAt: string;
  registerMethod: string;
  forcedTags: string[];
  invalidTags: string[];
  validTags: string[];
  givenName: string;
  online: boolean;
  approvedRoutes: string[];
  availableRoutes: string[];
  subnetRoutes: string[];
}

export interface User {
  id: string;
  name: string;
  createdAt: string;
  displayName?: string;
  email?: string;
  provider?: string;
}

export interface InfoRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  onEdit?: () => void;
}
