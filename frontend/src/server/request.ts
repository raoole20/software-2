
import axios, { AxiosError } from 'axios'
import { redirect } from 'next/navigation'

export const request = axios.create({
  baseURL: process.env.API_URL
})

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