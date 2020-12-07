import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import spotifyOAuth from '../services/spotifyOAuth'
import spotifyApi from '../services/spotifyApi'

interface AuthContextData {
  loading: boolean,

  signed: boolean,

  logIn(): void,
  logOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
  const [oAuthCode, setOAuthCode] = useState<string | undefined>(undefined)

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [refreshToken, seRefreshToken] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const [[, oAuthCodeStoraged], [, accessTokenStoraged], [, refreshTokenStoraged]] = await AsyncStorage.multiGet(
        [
          '@SpotHackAuth:oAuthCode',
          '@SpotHackAuth:accessToken',
          '@SpotHackAuth:refreshToken'
        ]
      )

      if (oAuthCodeStoraged && accessTokenStoraged && refreshTokenStoraged) {
        setOAuthCode(oAuthCodeStoraged)
        seRefreshToken(refreshTokenStoraged)
        setAccessToken(accessTokenStoraged)

        spotifyApi.defaults.headers.Authorization = `Bearer ${accessToken}`
      }
    })()

    setLoading(false)
  }, [])

  const logIn = async () => {
    await spotifyOAuth.getoAuthCode(setOAuthCode)
    // This will change the value on oAuthCode and fire the next useEffect
  }

  useEffect(() => {
    (async () => {
      if (oAuthCode) {
        if (oAuthCode !== 'error') {
          const credentials = await spotifyOAuth.getOauthCredentials(oAuthCode)

          if (credentials.access_token && credentials.refresh_token) {
            if (credentials.access_token !== 'error' && credentials.refresh_token !== 'error') {
              setAccessToken(credentials.access_token)
              seRefreshToken(credentials.refresh_token)

              AsyncStorage.multiSet([
                ['@SpotHackAuth:oAuthCode', oAuthCode],
                ['@SpotHackAuth:accessToken', credentials.access_token],
                ['@SpotHackAuth:refreshToken', credentials.refresh_token]
              ])

              spotifyApi.defaults.headers.Authorization = `Bearer ${accessToken}`
            }
          }
        }
      }
    })()
  }, [oAuthCode])

  const logOut = () => {
    if (accessToken) {
      try {
        setOAuthCode(undefined)
        setAccessToken(undefined)
        seRefreshToken(undefined)

        AsyncStorage.clear()

        return { response: 'sucess on logout', logout: 1 }
      } catch (err) {
        return { response: 'error on logout', logout: 0 }
      }
    }
  }

  return (
    <AuthContext.Provider value={{ loading, signed: !!accessToken, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth () {
  const context = useContext(AuthContext)

  return context
}
