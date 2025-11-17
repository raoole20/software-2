import axios, { AxiosError } from 'axios'
import { getSession } from '@/lib'
import { redirect } from 'next/navigation'

export const request = axios.create({
  baseURL: process.env.API_URL
})

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

async function authRequest<T = any>({ method, url, data, params }: { method: Method; url: string; data?: any; params?: any; }): Promise<T> {
  const session = await getSession()
  try {
    const res = await request.request<T>({
      method,
      url,
      data,
      params,
      headers: {
        Authorization: session ? `Token ${session?.accessToken}` : undefined,
      },
    })
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      // normalize axios error for callers
      throw {
        isAxiosError: true,
        status: error.response?.status ?? 500,
        data: error.response?.data ?? { detail: error.message },
        message: error.message,
        original: error,
      }
    }

    throw error
  }
}

export const apiGet = <T = any>(url: string, params?: any) => authRequest<T>({ method: 'get', url, params })
export const apiPost = <T = any>(url: string, data?: any) => authRequest<T>({ method: 'post', url, data })
export const apiPut = <T = any>(url: string, data?: any) => authRequest<T>({ method: 'put', url, data })
export const apiPatch = <T = any>(url: string, data?: any) => authRequest<T>({ method: 'patch', url, data })
export const apiDelete = <T = any>(url: string) => authRequest<T>({ method: 'delete', url })

// Uniform service-level response to avoid repeating shapes in each server function
export type ServiceResponse<T> =
  | { message: string; status: number; controller: true; data: T; originalError: null; error: false }
  | { message: string; status: number; controller: true; data: any; originalError: any; error: true }

function buildSuccess<T>(data: T, message: string, status = 200): ServiceResponse<T> {
  return { message, status, controller: true, data, originalError: null, error: false }
}

function buildError(error: any, fallbackMessage: string): ServiceResponse<any> {
  const status = error?.status ?? error?.response?.status ?? 500
  const data = error?.data ?? error?.response?.data ?? { detail: error?.message ?? fallbackMessage }
  const message = error?.message ?? fallbackMessage
  return { message, status, controller: true, data, originalError: error, error: true }
}

export async function serviceGetResult<T>(url: string, successMessage = 'OK', params?: any): Promise<ServiceResponse<T>> {
  try {
    const data = await apiGet<T>(url, params)
    return buildSuccess<T>(data, successMessage, 200)
  } catch (error: any) {
    return buildError(error, `Error fetching resource`)
  }
}

export async function servicePostResult<T>(url: string, body?: any, successMessage = 'OK'): Promise<ServiceResponse<T>> {
  try {
    const data = await apiPost<T>(url, body)
    return buildSuccess<T>(data, successMessage, 200)
  } catch (error: any) {
    return buildError(error, `Error posting resource`)
  }
}

export async function servicePutResult<T>(url: string, body?: any, successMessage = 'OK'): Promise<ServiceResponse<T>> {
  try {
    const data = await apiPut<T>(url, body)
    return buildSuccess<T>(data, successMessage, 200)
  } catch (error: any) {
    return buildError(error, `Error updating resource`)
  }
}

export async function servicePatchResult<T>(url: string, body?: any, successMessage = 'OK'): Promise<ServiceResponse<T>> {
  try {
    const data = await apiPatch<T>(url, body)
    return buildSuccess<T>(data, successMessage, 200)
  } catch (error: any) {
    return buildError(error, `Error updating resource`)
  }
}

export async function serviceDeleteResult<T>(url: string, successMessage = 'OK'): Promise<ServiceResponse<T>> {
  try {
    const data = await apiDelete<T>(url)
    return buildSuccess<T>(data, successMessage, 200)
  } catch (error: any) {
    return buildError(error, `Error deleting resource`)
  }
}
request.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      // If running in the browser, do a client redirect (and clear stored token)
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('token') } catch (e) { /* ignore */ }
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      // On the server we should NOT call `redirect()` here because that throws
      // a NEXT_REDIRECT out of context. Let the caller (server component/action)
      // handle server-side redirects.
      console.warn('Request interceptor: received 401 on server; caller must handle redirect')
    }

    return Promise.reject(error)
  }
)
