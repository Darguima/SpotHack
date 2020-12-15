import React, { createContext, useContext, useState } from 'react'

interface AppUtilsContextData {
  changeMusicSearchInputValue: (newValue: string) => void,
  setChangeMusicSearchInputValue: React.Dispatch<React.SetStateAction<() => (newValue: string) => void>>,

  changePlaylistSearchInputValue: (newValue: string) => void,
  setChangePlaylistSearchInputValue: React.Dispatch<React.SetStateAction<() => (newValue: string) => void>>
}

const AppUtilsContext = createContext<AppUtilsContextData>({} as AppUtilsContextData)

export const AppUtilsProvider:React.FC = ({ children }) => {
  const [changeMusicSearchInputValue, setChangeMusicSearchInputValue] = useState<() => (newValue: string) => void>({} as () => (newValue: string) => void)
  const [changePlaylistSearchInputValue, setChangePlaylistSearchInputValue] = useState<() => (newValue: string) => void>({} as () => (newValue: string) => void)

  return (
    <AppUtilsContext.Provider value={{
      changeMusicSearchInputValue,
      setChangeMusicSearchInputValue,

      changePlaylistSearchInputValue,
      setChangePlaylistSearchInputValue
    }}>
      {children}
    </AppUtilsContext.Provider>
  )
}

export default () => (useContext(AppUtilsContext))
