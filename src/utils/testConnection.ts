import axios from 'axios';
import config from '../config/environment';

export const testBackendConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log(`Testing connection to: ${config.api.baseUrl}`);
    
    // Test basic connectivity
    const healthResponse = await axios.get(`${config.api.baseUrl.replace('/api', '')}/health`, {
      timeout: 5000
    });
    
    return {
      success: true,
      message: 'Successfully connected to C# .NET backend',
      details: {
        status: healthResponse.status,
        environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
        baseUrl: config.api.baseUrl
      }
    };
  } catch (error: any) {
    let message = 'Failed to connect to backend';
    let details: any = { environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development', baseUrl: config.api.baseUrl };
    
    if (error.code === 'ECONNREFUSED') {
      message = 'Backend server is not running. Please start your C# .NET API on port 5015';
      details.suggestion = 'Run: dotnet run in your C# backend project';
    } else if (error.response) {
      message = `Backend responded with error: ${error.response.status}`;
      details.response = error.response.data;
    } else if (error.request) {
      message = 'Network error - check your connection';
      details.error = error.message;
    }
    
    return {
      success: false,
      message,
      details
    };
  }
};

export const testApiEndpoints = async (): Promise<{
  success: boolean;
  results: Array<{ endpoint: string; status: string; message: string }>;
}> => {
  const endpoints = [
    { name: 'Health Check', url: `${config.api.baseUrl.replace('/api', '')}/health` },
    { name: 'Tasks Available', url: `${config.api.baseUrl}/Tasks/available?Page=1&PageSize=5` },
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, {
        timeout: 5000
      });
      
      results.push({
        endpoint: endpoint.name,
        status: 'SUCCESS',
        message: `Status: ${response.status}`
      });
    } catch (error: any) {
      results.push({
        endpoint: endpoint.name,
        status: 'FAILED',
        message: error.response?.status ? `Status: ${error.response.status}` : error.message
      });
    }
  }
  
  const allSuccess = results.every(r => r.status === 'SUCCESS');
  
  return {
    success: allSuccess,
    results
  };
};