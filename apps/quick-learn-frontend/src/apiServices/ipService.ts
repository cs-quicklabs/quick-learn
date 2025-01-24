import axios from 'axios';

let clientIp: string | null = null;
let isLoading = false;

// Function to fetch and cache the client IP address
export const getClientIp = async (): Promise<string> => {
  if (!clientIp && !isLoading) {
    isLoading = true;
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      clientIp = response.data.ip;
      isLoading = false;
    } catch (error) {
      console.error('Error fetching client IP:', error);
      isLoading = false;
      clientIp = '0.0.0.0'; // Default IP in case of error
    }
  }
  return clientIp ?? '0.0.0.0';
};
