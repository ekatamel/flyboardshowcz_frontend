import { useState } from 'react'
import { AuthenticatedUser } from 'types/types'

export const useSessionStorage = (
  keyName: string,
  defaultValue: AuthenticatedUser | null,
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.sessionStorage.getItem(keyName)
      if (value) {
        return JSON.parse(value)
      } else {
        window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue))
        return defaultValue
      }
    } catch (_) {
      return defaultValue
    }
  })

  const setValue = (newValue: any) => {
    try {
      window.sessionStorage.setItem(keyName, JSON.stringify(newValue))
    } catch (err) {
      console.log(err)
    }
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}
