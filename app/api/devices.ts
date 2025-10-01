import { getApiEndpoints, makeApiRequest } from "../utils/apiUtils";

export async function getDevices() {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  return {
    "nodes": [
        {
            "id": "2",
            "machineKey": "mkey:23aac7778c52784ea54e5d105cf04839191a77da1e46e1b03e56466af6fac15a",
            "nodeKey": "nodekey:20e11fe0774d0df8f42820166e10976f33f5c94adbf4e1f5f3afae0f0b1d1a5f",
            "discoKey": "discokey:725bd01a7d100261f2f4887dfb23934fd308810d51410e588421e0d3447b992c",
            "ipAddresses": [
                "100.64.0.2"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "8",
                "name": "example-services",
                "createdAt": "2024-11-10T01:49:51.352439623Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-12T16:02:43.659739649Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "8",
                    "name": "example-services",
                    "createdAt": "2024-11-10T01:49:51.352439623Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "4",
                "key": "179d8e1136e7da2ed82c9e2e36dc48872481f21f59162fe0",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2024-11-10T03:28:54.295147463Z",
                "createdAt": "2024-11-10T02:28:54.296836284Z",
                "aclTags": []
            },
            "createdAt": "2024-11-10T02:29:11.573052623Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": false,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "4",
            "machineKey": "mkey:b7ed6e38a58ed229bafe5b0613dbcbc98db1b292a4336fc4d52ed6b57ecfa117",
            "nodeKey": "nodekey:df30135e641d085d51054529dd2c342357027dabcde2c04121f822fc03f99c5b",
            "discoKey": "discokey:d1fde175a80525851e13afc3924078288a4e997a8acd06cbcab7288a9706aa35",
            "ipAddresses": [
                "100.64.0.5"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "5",
                "name": "example-phone",
                "createdAt": "2024-11-10T01:48:53.914980651Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-19T14:29:50.016892143Z",
            "expiry": null,
            "preAuthKey": null,
            "createdAt": "0001-01-01T00:00:00Z",
            "registerMethod": "REGISTER_METHOD_CLI",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": true,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "5",
            "machineKey": "mkey:41b6d84323a2fed02a4af2f5f3190eaaf5f609641fcfaddef428352f32687517",
            "nodeKey": "nodekey:4aa67204e3ceec1849e1e0dcd9a8426227d321982960807809464d134ad26a1e",
            "discoKey": "discokey:93b1e3c85d2f77892d5ef709a7a2b2f564a7f7bc0c294a550baa6a4d2dfc4665",
            "ipAddresses": [
                "100.64.0.6"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "8",
                "name": "example-services",
                "createdAt": "2024-11-10T01:49:51.352439623Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-12T16:03:58.898639048Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "8",
                    "name": "example-services",
                    "createdAt": "2024-11-10T01:49:51.352439623Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "7",
                "key": "49ee76ea5403fccaba7bef2a067019dd155d8ad6bf9fc0cd",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2024-11-10T18:39:16.612959777Z",
                "createdAt": "2024-11-10T17:39:16.615578940Z",
                "aclTags": []
            },
            "createdAt": "2024-11-10T17:42:27.000884056Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": false,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "6",
            "machineKey": "mkey:8baaf66aa8ba3c18d5432347c4ba39c550ad49ea3aca84a3feafca8ee7b12d1f",
            "nodeKey": "nodekey:85688df1049313b706ec8b36742f8c09ffa648a19f5474d76e97fbf8aa3ce116",
            "discoKey": "discokey:96afbd0e6a327353cdae1bfbeb7c8c5bfa9e18fe33acb076dbd156e625615704",
            "ipAddresses": [
                "100.64.0.7"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "8",
                "name": "example-services",
                "createdAt": "2024-11-10T01:49:51.352439623Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-12T16:02:51.508370299Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "8",
                    "name": "example-services",
                    "createdAt": "2024-11-10T01:49:51.352439623Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "8",
                "key": "909e3bcc2f08eacc3f854b37f1b5e255187e7ec6096e6986",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2024-11-10T18:45:53.913633517Z",
                "createdAt": "2024-11-10T17:45:53.916705175Z",
                "aclTags": []
            },
            "createdAt": "2024-11-10T17:46:03.030394490Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": false,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "12",
            "machineKey": "mkey:8340824649f8a46ddf70cda87b1804d294df699ac2f86f8c86f2d9af7faed64c",
            "nodeKey": "nodekey:3b9e6a516ec82830aaac461861d753ab92ca9a020c6444a6e4e7e137615dc41c",
            "discoKey": "discokey:6a1927df738adc3554aeee59816bb5e34fbf3952595fbd2a13063a1c9bff0d4a",
            "ipAddresses": [
                "100.64.0.10"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "3",
                "name": "example-laptop",
                "createdAt": "2024-11-10T01:48:10.328159447Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-05-05T03:19:48.773917756Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "3",
                    "name": "example-laptop",
                    "createdAt": "2024-11-10T01:48:10.328159447Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "14",
                "key": "c274e614f4a1c32137b98303137a37512a492fb56aa33dc2",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2024-12-13T19:18:33.416051906Z",
                "createdAt": "2024-12-13T18:18:33.419076931Z",
                "aclTags": []
            },
            "createdAt": "2024-12-13T18:30:47.918846442Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": false,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "14",
            "machineKey": "mkey:d1e60ef00b1a7e7a2f13a4286c178a0cd642ac6b112782ae066752a51d5caf49",
            "nodeKey": "nodekey:337f8b34e83ce8df7945307fa3a234717a994b94b04ee000eda4a1d907d22276",
            "discoKey": "discokey:906fff0574eb3a0d92aa2794eb8f2ecee997debe88e5aa8260d966c4ec33ae7a",
            "ipAddresses": [
                "100.64.0.12"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "4",
                "name": "example-desktop",
                "createdAt": "2024-11-10T01:48:15.731355130Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-19T14:28:59.017134300Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "4",
                    "name": "example-desktop",
                    "createdAt": "2024-11-10T01:48:15.731355130Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "16",
                "key": "df00fb86b0a98e75672878dd8c7fe932fe2bba588065b145",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2024-12-26T21:03:54.906576520Z",
                "createdAt": "2024-12-26T20:03:54.908517108Z",
                "aclTags": []
            },
            "createdAt": "2024-12-26T20:05:39.581887360Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": true,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "16",
            "machineKey": "mkey:509a1184e7bea8a31ee00cef3f03f7c96da1f79fbf9e096221738a2b8ef29635",
            "nodeKey": "nodekey:b95516c27d752b54ab4ad31c0898fadbc4107c8b48d417ad3ce07a538c13ca4c",
            "discoKey": "discokey:1fc2b1c62e36ed64f1b3f964dc11436439c4aa3ed270cdaf7ac23e2612bfc018",
            "ipAddresses": [
                "100.64.0.14"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "2",
                "name": "example-iot",
                "createdAt": "2024-11-10T01:47:51.355254176Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-12T16:04:12.351452664Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "2",
                    "name": "example-iot",
                    "createdAt": "2024-11-10T01:47:51.355254176Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "20",
                "key": "74c6d8b02eed0999f962d549977437ca91a2d3b789e43fb7",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2025-01-02T18:56:13.621700459Z",
                "createdAt": "2025-01-02T17:56:13.623972259Z",
                "aclTags": []
            },
            "createdAt": "2025-01-02T17:59:51.490804758Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": false,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
        {
            "id": "17",
            "machineKey": "mkey:5a400aa4b3a11d49115f7647f7efcbe3335180a1823e2990c175329541984a2d",
            "nodeKey": "nodekey:7d802c99425f55024e75590563fea1bfb2650b1b79f467db2803b5cbfd7ad873",
            "discoKey": "discokey:22315028798390b238e83635a1e5e61a23919dd066c8ed0a7db89a251bfbb046",
            "ipAddresses": [
                "100.64.0.15"
            ],
            "name": "exmaple-device",
            "user": {
                "id": "8",
                "name": "example-services",
                "createdAt": "2024-11-10T01:49:51.352439623Z",
                "displayName": "",
                "email": "",
                "providerId": "",
                "provider": "",
                "profilePicUrl": ""
            },
            "lastSeen": "2025-09-19T01:36:36.930279661Z",
            "expiry": "0001-01-01T00:00:00Z",
            "preAuthKey": {
                "user": {
                    "id": "8",
                    "name": "example-services",
                    "createdAt": "2024-11-10T01:49:51.352439623Z",
                    "displayName": "",
                    "email": "",
                    "providerId": "",
                    "provider": "",
                    "profilePicUrl": ""
                },
                "id": "21",
                "key": "f23f17f906cdf578231a51f594a58d5ee2d927d7dafbbfc1",
                "reusable": false,
                "ephemeral": false,
                "used": true,
                "expiration": "2025-01-03T23:08:15.846980150Z",
                "createdAt": "2025-01-03T22:08:15.848795326Z",
                "aclTags": []
            },
            "createdAt": "2025-01-03T22:09:22.939249729Z",
            "registerMethod": "REGISTER_METHOD_AUTH_KEY",
            "forcedTags": [],
            "invalidTags": [],
            "validTags": [],
            "givenName": "exmaple-device",
            "online": false,
            "approvedRoutes": [],
            "availableRoutes": [],
            "subnetRoutes": []
        },
    ]
}
  
  await makeApiRequest(endpoints.devices.get, { method: 'GET' });
}

export async function registerDevice(user: string, key: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  // Convert user string to number if needed
  const userParam = isNaN(Number(user)) ? user : Number(user);
  const apiCall = endpoints.devices.registerDevice(userParam as number, key);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function renameDevice(id: string, newName: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  const apiCall = endpoints.devices.renameDevice(deviceId as number, newName);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function deleteDevice(id: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  const apiCall = endpoints.devices.deleteDevice(deviceId as number);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}

export async function addTags(id: string, tags: string[]) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  
  // Format tags with "tag:" prefix and normalize
  const formattedTags = tags.map(tag => `tag:${tag.trim().toLowerCase()}`);
  const apiCall = endpoints.devices.addTags(deviceId as number, formattedTags);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
    body: JSON.stringify(apiCall.body),
  });
}

export async function removeTags(id: string, tags: string[]) {
  // TODO: Implement when API endpoint is available
  console.warn("removeTags not yet implemented - API endpoint needed");
  return null;
}

export async function changeUser(id: string, user: string) {
  const config = await getApiEndpoints();
  if (!config) return null;

  const { endpoints } = config;
  const deviceId = isNaN(Number(id)) ? id : Number(id);
  const apiCall = endpoints.devices.changeUser(deviceId as number, user);
  
  return await makeApiRequest(apiCall.url, {
    method: apiCall.method,
  });
}