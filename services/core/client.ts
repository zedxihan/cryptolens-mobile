import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      console.error(
        `API Error ${error.response.status}: ${error.response.data}`,
      );
    } else if (error.request) {
      console.error('API Error: No response received from server');
    } else {
      console.error(`API Error: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

export async function fetchGet<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}
