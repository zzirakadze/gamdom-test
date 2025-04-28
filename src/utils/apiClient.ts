import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const RESET = "\x1b[0m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string, authToken?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        ...(authToken ? { Authorization: `Basic ${authToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });
  }

  private logRequest(method: string, url: string, body?: any) {
    console.log(`${CYAN}\n=========== REQUEST ===========`);
    console.log(`${YELLOW}${method.toUpperCase()} ${url}${RESET}`);
    if (body) {
      console.log(`${CYAN}Payload:${RESET}`);
      console.log(JSON.stringify(body, null, 2));
    }
    console.log(`${CYAN}===============================\n${RESET}`);
  }

  private logResponse(method: string, url: string, response: AxiosResponse) {
    console.log(`${CYAN}\n=========== RESPONSE ===========`);
    console.log(`${GREEN}${method.toUpperCase()} ${url}${RESET}`);
    console.log(`${GREEN}Status: ${response.status}${RESET}`);
    console.log(`${CYAN}Data:${RESET}`);
    console.log(JSON.stringify(response.data, null, 2));
    console.log(`${CYAN}===============================\n${RESET}`);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logRequest('GET', url);
    const response = await this.client.get<T>(url, config);
    this.logResponse('GET', url, response);
    return response;
  }

  async post<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logRequest('POST', url, body);
    const response = await this.client.post<T>(url, body, config);
    this.logResponse('POST', url, response);
    return response;
  }

  async put<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logRequest('PUT', url, body);
    const response = await this.client.put<T>(url, body, config);
    this.logResponse('PUT', url, response);
    return response;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logRequest('DELETE', url);
    const response = await this.client.delete<T>(url, config);
    this.logResponse('DELETE', url, response);
    return response;
  }
}
