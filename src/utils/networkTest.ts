import axios from 'axios';

export const testNetworkConnection = async () => {
  const testUrls = [
    'http://10.0.2.2:5015/api',  // Android emulator
    'http://localhost:5015/api', // iOS simulator
    'http://127.0.0.1:5015/api', // Alternative localhost
  ];

  for (const url of testUrls) {
    try {
      console.log(`Testing connection to: ${url}`);
      const response = await axios.get(`${url}/health`, { timeout: 5000 });
      console.log(`✅ Connected to: ${url}`, response.status);
      return url;
    } catch (error: any) {
      console.log(`❌ Failed to connect to: ${url}`, error.message);
    }
  }
  
  console.log('❌ All connection attempts failed');
  return null;
};