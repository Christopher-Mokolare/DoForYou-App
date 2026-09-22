const ENV = {
  development: {
    api: {
      baseUrl: 'https://qa-api.doforyou.co.za',
      timeout: 30000,
    },
    websocket: {
      url: 'https://qa-api.doforyou.co.za/api/v1/hubs/chat'
    },
    enableLogging: true,
    enableMockData: false
  },
  production: {
    api: {
      baseUrl: 'https://api.doforyou.co.za',
      timeout: 30000,
    },
    websocket: {
      url: 'https://api.doforyou.co.za/api/v1/hubs/chat'
    },
    enableLogging: false,
    enableMockData: false
  }
};

const getEnvVars = () => {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';
  return ENV[environment as keyof typeof ENV] || ENV.development;
};

export default getEnvVars();
