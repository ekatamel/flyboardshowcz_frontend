import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import axiosClient from 'utils/axios-instance'
import { getApiKey } from 'utils/requests'
import { getCookie, setCookie } from 'utils/utils'

type APIAccessContextType = {
  apiKey: string | null
  refreshApiKey: () => Promise<string | null>
}

const APIAccessContext = createContext<APIAccessContextType>({
  apiKey: null,
  refreshApiKey: async () => null,
})

export const useApiAccess = () => useContext(APIAccessContext)

interface ApiAccessProviderProps {
  children: React.ReactNode
}

export const ApiAccessProvider = ({ children }: ApiAccessProviderProps) => {
  const [apiKey, setApiKey] = useState<string | null>(getCookie('apiKey'))
  const [isReady, setIsReady] = useState(false) // Track if the API key is ready

  const refreshApiKey = useCallback(async () => {
    try {
      const response = await getApiKey()
      if (response.api_key) {
        setCookie('apiKey', response.api_key, 3)
        setApiKey(response.api_key)
        return response.api_key
      }
    } catch (error) {
      console.error('Failed to refresh API key:', error)
      window.location.href = '/login'
    }
    return null
  }, [])

  // Fetch the API key on initial load
  useEffect(() => {
    const fetchApiKey = async () => {
      if (!apiKey) {
        await refreshApiKey()
      }
      setIsReady(true) // Mark the API key as ready
    }

    fetchApiKey()
  }, [apiKey, refreshApiKey])

  // Attach the API key to all requests
  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(config => {
      const apiKey = getCookie('apiKey')
      if (apiKey) {
        config.headers['X-API-Key'] = apiKey
      }
      return config
    })

    const responseInterceptor = axiosClient.interceptors.response.use(
      response => response,
      async error => {
        if (error?.response?.status === 401) {
          const newApiKey = await refreshApiKey()
          if (newApiKey) {
            error.config.headers['X-API-Key'] = newApiKey
            return axiosClient(error.config)
          }
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor)
      axiosClient.interceptors.response.eject(responseInterceptor)
    }
  }, [refreshApiKey])

  // Wait for the API key to be ready before rendering children
  if (!isReady) {
    return null // Or a loading spinner
  }

  const value = { apiKey, refreshApiKey }

  return (
    <APIAccessContext.Provider value={value}>
      {children}
    </APIAccessContext.Provider>
  )
}
