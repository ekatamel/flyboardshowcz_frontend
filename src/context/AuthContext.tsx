import { useToastMessage } from 'hooks/useToastMesage'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import { AuthenticatedUser, NewUser } from 'types/types'
import { loginUser, registerUser, validateToken } from 'utils/requests'
import { deleteCookie, getCookie, setCookie } from 'utils/utils'

type AuthContextType = {
  currentUser: AuthenticatedUser | null
  login: ({
    username,
    password,
    admin,
  }: {
    username: string
    password: string
    admin: boolean
  }) => Promise<void>
  logout: () => void
  signUp: (user: NewUser) => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { showToast } = useToastMessage()

  const currentUser = getCookie('fbsUser')
    ? (JSON.parse(getCookie('fbsUser')!) as AuthenticatedUser)
    : null

  const login = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<void> => {
    try {
      const response = await loginUser({ username, password })

      if (response.code === 200) {
        const fbsUser = {
          username: response.username,
          access_token: response.access_token,
          admin: response.admin,
        }

        setCookie('fbsUser', JSON.stringify(fbsUser), 3)
        window.location.href = '/admin/rezervace'
      } else {
        showToast({
          status: 'error',
        })
      }
    } catch (error: any) {
      showToast({
        status: 'error',
        message: error.message,
      })
    }
  }

  const logout = useCallback(() => {
    deleteCookie('fbsUser')
    window.location.href = '/login'
  }, [])

  const signUp = async (user: NewUser): Promise<void> => {
    try {
      const response = await registerUser(user)
      if (response.code === 201) {
        showToast({
          status: 'success',
          message:
            'Uživatel vytvořen, prosím kontaktujte admina pro dokončení registrace',
        })
      } else {
        showToast({
          status: 'error',
          message: response.message,
        })
      }
    } catch (error: any) {
      showToast({
        status: 'error',
        message: error.message,
      })
    }
  }

  const value = {
    currentUser,
    login,
    logout,
    signUp,
  }

  useEffect(() => {
    const validateUserToken = async () => {
      if (currentUser && currentUser.access_token) {
        try {
          const response = await validateToken(
            currentUser.username,
            currentUser.access_token,
          )
          if (response.code !== 200) {
            logout()
          }
        } catch (error) {
          console.error('Token validation error:', error)
          logout()
        }
      }
    }

    if (window.location.pathname.startsWith('/admin')) validateUserToken()
  }, [currentUser, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
