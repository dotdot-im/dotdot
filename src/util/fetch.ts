import { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'

import { API_URL } from '../constants'

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export const CSRF_HEADER = 'x-csrf-token'
let csrfToken = ''

export type FetchError = {
  status: number
  message: string
  errors: string[]
  data?: any
}

type FetchReturn<T> = [boolean, T | null, FetchError | null]

axios.defaults.withCredentials = true

function useFetch<T>(
  path: string,
  method: FetchMethod,
  body?: any
): FetchReturn<T> {
  const [error, setError] = useState<FetchError | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [response, setResponse] = useState<T | null>(null)

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const data = await fetchResource(path, method, body)
        setResponse(data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    sendRequest()
  }, [path, method, body])

  return [loading, response, error]
}

export const fetchResource = async (
  path: string,
  method: FetchMethod,
  body?: any
) => {
  if (!path) {
    throw new Error(`'url' is required for fetching data`)
  }

  const url = `${API_URL}${path}`
  const options: AxiosRequestConfig = {
    url,
    method,
    data: body,
    timeout: 6000,
    withCredentials: true,
    xsrfHeaderName: CSRF_HEADER,
    headers: {},
  }

  if (csrfToken.length > 0) {
    options.headers[CSRF_HEADER] = csrfToken
  }

  try {
    const response = await axios(options)

    if (response.headers[CSRF_HEADER]) {
      csrfToken = response.headers[CSRF_HEADER]
    }

    return await response.data
  } catch (error) {
    if (error.response) {
      console.warn(`useFetch error on ${method} ${path}`, error.response)
      const returnError: FetchError = {
        status: error.response.status,
        message: parseAxiosError(error),
        errors: parseErrorList(error),
        data: error.response.data
      }
      throw returnError
    }

    console.warn(`useFetch network error on ${method} ${path}`, error)
    const returnError: FetchError = {
      status: 500,
      message: error.message,
      errors: [error.message],
    }
    throw returnError
  }
}

function parseAxiosError(error: AxiosError): string {
  if (!error.response || !error.response.data) {
    return error.message || 'An error occurred'
  }

  return parseErrorList(error).join('. ')
}

function parseErrorList(error: AxiosError): string[] {
  const defaultError = 'An error occurred'
  if (!error.response || !error.response.data) {
    return [error.message || defaultError]
  }

  return parseErrors(
    defaultError,
    error.response.data,
    error.response.data.errors,
    error.response.data.error
  )
}

function parseErrors(defaultError: string, ...errors: any[]): string[] {
  for (let i = 0; i < errors.length; i++) {
    const error = errors[i]
    if (Array.isArray(error)) return error
    if (typeof error === 'string') return [error]
  }

  return [defaultError]
}

export default useFetch
