// ----------------------------------------------------
// Author: Faizan Ansari
// Project:E-Commerce App
// File: HTTPHelper.ts
// Description: Global API Service (CRUD)
// ----------------------------------------------------

import HTTPProvider from "./HttpProvider";


class ApiServiceClass {
  // ============== POST ==============
  async postFromAPI(
    endpoint: string,
    data: any = {},
    token: string = '',
    extraConfig: any = {}, // optional config (for headers or params)
  ): Promise<any> {
    try {
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(extraConfig.headers || {}), //  merge custom headers if any
      };

      const response = await HTTPProvider.post(endpoint, data, {
        ...extraConfig,
        headers,
      });

      return response.data;
    } catch (error: any) {
      console.log('postFromAPI Error:', error?.response?.data || error.message);
      throw error;
    }
  }

  // ============== GET ==============
  async getFromAPI(endpoint: string, token: string = ''): Promise<any> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await HTTPProvider.get(endpoint, { headers });
      return response.data;
    } catch (error: any) {
      console.log('getFromAPI Error:', error?.response?.data || error.message);
      throw error;
    }
  }

  // ============== PUT ==============
  async putToAPI(
    endpoint: string,
    data: any = {},
    token: string = '',
  ): Promise<any> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await HTTPProvider.put(endpoint, data, { headers });
      return response.data;
    } catch (error: any) {
      console.log('putToAPI Error:', error?.response?.data || error.message);
      throw error;
    }
  }

  // ============== DELETE ==============
  async deleteFromAPI(endpoint: string, token: string): Promise<any> {
    if (!token) throw new Error('Token not found');

    try {
      const headers = {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      };
      const response = await HTTPProvider.delete(endpoint, { headers });
      return response.data;
    } catch (error: any) {
      console.log(
        'deleteFromAPI Error:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  }
}

const ApiService = new ApiServiceClass();
export default ApiService;