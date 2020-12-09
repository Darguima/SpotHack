/* eslint-disable camelcase */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Alert } from 'react-native'

import spotifyApi from '../services/spotifyApi'

import useAuth from './auth'

interface UserDataContextData {
  userData: SpotifyResponseSchema,

  refreshUserData: () => void
}

interface SpotifyResponseSchema {
  country: string,
  display_name: string,
  explicit_content: {
    filter_enabled: boolean,
    filter_locked: boolean,
  },
  external_urls: {
    spotify: string,
  },
  followers: {
    href: null,
    total: 0,
  },
  href: string,
  id: string,
  images: Array<{width: null | any, height: null | any, url: string}>,
  product: string,
  type: string,
  uri: string,

}

const UserDataContext = createContext<UserDataContextData>({} as UserDataContextData)

export const UserDataProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState({} as SpotifyResponseSchema)
  const { logOut } = useAuth()

  const requestSpotifyData = useCallback(() => {
    (async () => {
      try {
        const spotifyResponse: SpotifyResponseSchema = (await spotifyApi.get('me')).data

        setUserData(spotifyResponse)
      } catch (err) {
        Alert.alert('Something went wrong.')
        logOut()
      }
    })()
  }, [])

  useEffect(() => {
    requestSpotifyData()
  }, [requestSpotifyData])

  return (
    <UserDataContext.Provider value={{ userData, refreshUserData: requestSpotifyData }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default function useUserData () {
  return useContext(UserDataContext)
}
