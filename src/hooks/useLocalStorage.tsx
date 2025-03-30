import { useState } from 'react'
import { AuthenticatedUser } from 'types/types'

export const useLocalStorage = (
  keyName: string,
  defaultValue: AuthenticatedUser | null,
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName)
      if (value) {
        return JSON.parse(value)
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
        return defaultValue
      }
    } catch (_) {
      return defaultValue
    }
  })

  const setValue = (newValue: any) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue))
    } catch (err) {
      console.log(err)
    }
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}
