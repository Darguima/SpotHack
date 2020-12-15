/* eslint-disable camelcase */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Alert } from 'react-native'

import spotifyApi, { spotifyApiUserDataResponseItems, spotifyApiPlaylistsResponseItems, spotifyApiPlaylistsResponseItemsArrayItems } from '../services/spotifyApi'

import useAuth from './auth'

interface UserDataContextData {
  userData: spotifyApiUserDataResponseItems,
  refreshUserData: () => void,

  userPlaylists: Array<spotifyApiPlaylistsResponseItemsArrayItems>,
  refreshUserPlaylists: () => void
}

const UserDataContext = createContext<UserDataContextData>({} as UserDataContextData)

export const UserDataProvider: React.FC = ({ children }) => {
  const { logOut } = useAuth()

  /*
  *
  * userData
  *
  */

  const [userData, setUserData] = useState({} as spotifyApiUserDataResponseItems)

  const requestSpotifyUserData = useCallback(() => {
    (async () => {
      try {
        const spotifyResponse: spotifyApiUserDataResponseItems = (await spotifyApi.get('me')).data

        setUserData(spotifyResponse)
      } catch (err) {
        Alert.alert('Something went wrong.')
        logOut()
      }
    })()
  }, [])

  useEffect(() => {
    requestSpotifyUserData()
  }, [requestSpotifyUserData])

  /*
  *
  * userPlaylists
  *
  */

  const [userPlaylists, setUserPlaylists] = useState([] as Array<spotifyApiPlaylistsResponseItemsArrayItems>)

  const requestSpotifyUserPlaylistsData = useCallback(() => {
    (async () => {
      try {
        const spotifyResponse: spotifyApiPlaylistsResponseItems = (await spotifyApi.get('me/playlists', {
          params: {
            limit: 50
          }
        })).data

        console.log(spotifyResponse.items)

        setUserPlaylists(spotifyResponse.items)
      } catch (err) {
        Alert.alert('Something went wrong.')
        logOut()
      }
    })()
  }, [])

  useEffect(() => {
    requestSpotifyUserPlaylistsData()
  }, [requestSpotifyUserPlaylistsData])

  return (
    <UserDataContext.Provider value={{
      userData,
      refreshUserData: requestSpotifyUserData,

      userPlaylists,
      refreshUserPlaylists: requestSpotifyUserPlaylistsData
    }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default function useUserData () {
  return useContext(UserDataContext)
}
