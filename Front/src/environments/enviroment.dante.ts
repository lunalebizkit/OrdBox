interface WindowEnv {
  env?: {
    apiUrl?: string;
    apiVer?: number;
  };
}

declare const window: WindowEnv;

export const environment = {
  production: false,
  sistemaGestion:"http://apigestion.kiltex.com.ar/",
  api:{
    url: window?.env?.apiUrl ?? 'http://apigestion.local/api/',
    ver: window?.env?.apiVer ?? 1
  },
  images: {
    url: 'https://storage.googleapis.com/dev-sistemagestion/development/media/images/catalog',
    urlCommon: 'https://storage.googleapis.com/dev-sistemagestion/common',
    urlBadge: 'https://storage.googleapis.com/dev-sistemagestion/development/media/images/catalog'
  },
  name: "Refrigeraciones Dante",
};