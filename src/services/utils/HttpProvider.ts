// // ----------------------------------------------------
// // Author: Faizan Ansari
// // File: HTTPProvider.ts
// // Description: Axios instance & interceptors setup
// // ----------------------------------------------------

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = 'replace the URL';

console.log('BASE_URL =>', BASE_URL);

// Create axios instance
const HTTPProvider = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Request Interceptor
HTTPProvider.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log(' Token read error:', err);
    }

    console.log(' [Request]', config.method?.toUpperCase(), config.url);
    if (config.data) console.log(' Payload:', config.data);

    return config;
  },
  error => {
    console.log(' Request Interceptor Error:', error.message);
    return Promise.reject(error);
  },
);

//  Response Interceptor
HTTPProvider.interceptors.response.use(
  response => {
    console.log(
      ' [Response]',
      response.status,
      response.config.url,
      response.data?.message || '',
    );
    return response;
  },
  error => {
    if (error.response) {
      console.log(
        ' [API Error]',
        error.response.status,
        error.response.config.url,
        error.response.data?.message || error.response.data,
      );
    } else {
      console.log('[Network Error]', error.message);
    }
    return Promise.reject(error);
  },
);

export default HTTPProvider;