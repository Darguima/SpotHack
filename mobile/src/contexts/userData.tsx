/* eslint-disable camelcase */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Alert, ImageSourcePropType } from 'react-native'

import spotifyApi from '../services/spotify/spotifyApi'

import useAuth from './auth'

interface userDataSchema extends SpotifyApi.UserObjectPublic {
  image: ImageSourcePropType
}

interface userPlaylistDataSchema extends SpotifyApi.PlaylistObjectSimplified {
  image: ImageSourcePropType
}

interface UserDataContextData {
  userData: userDataSchema,
  refreshUserData: () => void,

  userPlaylists: Array<userPlaylistDataSchema>,
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

  const [userData, setUserData] = useState({} as userDataSchema)

  const requestSpotifyUserData = useCallback(() => {
    (async () => {
      try {
        const spotifyResponse: SpotifyApi.UserObjectPublic = (await spotifyApi.get('me')).data

        const spotifyResponseFiltered = {
          ...spotifyResponse,
          image: (spotifyResponse.images || []).length > 0
            ? { uri: (spotifyResponse.images![1] || spotifyResponse.images![0]).url }
            : require('../assets/icons/defaultIcon.png')
        }

        setUserData(spotifyResponseFiltered)
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

  const [userPlaylists, setUserPlaylists] = useState([] as Array<userPlaylistDataSchema>)

  const requestSpotifyUserPlaylistsData = useCallback(() => {
    (async () => {
      try {
        const spotifyResponse: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = (await spotifyApi.get('me/playlists', {
          params: {
            limit: 50
          }
        })).data

        const spotifyResponseFiltered = spotifyResponse.items.map(item => {
          const image: ImageSourcePropType = item.images.length > 0
            ? { uri: (item.images[1] || item.images[0]).url }
            : require('../assets/graySquare.jpg')

          return { ...item, image }
        })

        setUserPlaylists(spotifyResponseFiltered)
      } catch (err) {
        Alert.alert('Something went wrong getting your playlists.')
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
