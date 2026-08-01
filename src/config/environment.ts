const ENV = {
  development: {
    api: {
      baseUrl: 'https://qa-api.doforyou.co.za',
      timeout: 30000,
    },
    websocket: {
      url: 'wss://qa-api.doforyou.co.za/taskHub'
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
      url: 'wss://api.doforyou.co.za/taskHub'
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