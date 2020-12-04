import React, { createContext, useContext, useEffect, useState } from 'react'
import { TokenResponse } from 'expo-app-auth'

import spotifyApi from '../services/spotifyApi'
import AsyncStorage from '@react-native-community/async-storage'

interface AuthContextData {
  loading: boolean,

  accessToken: string | undefined,
  signed: boolean,

  apiLastResponse: TokenResponse | undefined,

  logIn(): Promise<{ response: string | any; login: number }>,
  logOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  const [apiLastResponse, setApiLastResponse] = useState<TokenResponse | undefined>(undefined)

  useEffect(() => {
    (async () => {
      const [[, apiLastResponseStoraged], [, accessTokenStoraged]] = await AsyncStorage.multiGet(['@SpotHackAuth:apiLastResponse', '@SpotHackAuth:accessToken'])

      if (apiLastResponseStoraged && accessTokenStoraged) {
        setApiLastResponse(JSON.parse(apiLastResponseStoraged))
        setAccessToken(accessTokenStoraged)
      }
    })()

    setLoading(false)
  }, [])

  const logIn = async () => {
    try {
      const response = await spotifyApi.login()

      if (response) {
        if (response.accessToken) {
          setApiLastResponse(response)
          AsyncStorage.setItem('@SpotHackAuth:apiLastResponse', JSON.stringify(response))

          setAccessToken(response.accessToken)
          AsyncStorage.setItem('@SpotHackAuth:accessToken', response.accessToken)

          return { response: response.accessToken, login: 1 }
        } else {
          return { response: 'response.accessToken is empty', login: 0 }
        }
      } else {
        return { response: 'response is empty', login: 1 }
      }
    } catch (err) { return { response: err, login: 0 } }
  }

  const logOut = () => {
    if (accessToken) {
      try {
        spotifyApi.logout(accessToken)

        setAccessToken(undefined)
        setApiLastResponse(undefined)

        AsyncStorage.clear()

        return { response: 'sucess on logout', logout: 1 }
      } catch (err) {
        return { response: 'error on logout', logout: 0 }
      }
    }
  }

  return (
    <AuthContext.Provider value={{ loading, signed: !!accessToken, accessToken, apiLastResponse, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth () {
  const context = useContext(AuthContext)

  return context
}
