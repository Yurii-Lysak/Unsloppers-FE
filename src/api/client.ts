/**
 * Axios HTTP client
 */

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { env } from '@/config/env'

type UnauthorizedListener = () => void

class ApiClient {
  private client: AxiosInstance
  private unauthorizedListeners = new Set<UnauthorizedListener>()

  constructor() {
    this.client = axios.create({
      baseURL: env.api.baseUrl,
      timeout: env.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          const requestUrl = error.config?.url ?? ''
          const isAuthAttempt =
            requestUrl.includes('/auth/login') || requestUrl.includes('/auth/logout')
          if (!isAuthAttempt) {
            this.unauthorizedListeners.forEach(listener => listener())
          }
        }
        return Promise.reject(error)
      }
    )
  }

  onUnauthorized(listener: UnauthorizedListener): () => void {
    this.unauthorizedListeners.add(listener)
    return () => this.unauthorizedListeners.delete(listener)
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  /**
   * Raw axios instance for advanced usage
   */
  get raw(): AxiosInstance {
    return this.client
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
