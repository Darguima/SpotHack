import AsyncStorage from '@react-native-community/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ImageSourcePropType } from 'react-native'

export interface musicsSpotifyResponseSchema {
  spotifyId: string,

  image: ImageSourcePropType,

  title: string,
  artists: string
}

interface UserHistoryContextData {
  musicSearchHistory: Array<musicsSpotifyResponseSchema>,
  addMusicToMusicSearchHistory: (musicData: musicsSpotifyResponseSchema) => void
  removeMusicFromMusicSearchHistory: (spotifyId:string) => void

}

const UserHistoryContext = createContext<UserHistoryContextData>({} as UserHistoryContextData)

export const UserHistoryProvider: React.FC = ({ children }) => {
  const [musicSearchHistory, setMusicSearchHistory] = useState<Array<musicsSpotifyResponseSchema>>([])

  useEffect(() => {
    (async () => {
      const [[, musicSearchHistoryStoraged]] = await AsyncStorage.multiGet(['musicSearchHistory'])

      if (musicSearchHistoryStoraged) {
        setMusicSearchHistory(JSON.parse(musicSearchHistoryStoraged))
      }
    })()
  }, [])

  const addMusicToMusicSearchHistory = (musicData: musicsSpotifyResponseSchema) => {
    console.log('3')
    const musicsIds = musicSearchHistory.map(item => (item.spotifyId))
    const sameMusicIndex = musicsIds.indexOf(musicData.spotifyId)

    const newMusicSearchHistory = [...musicSearchHistory]

    if (sameMusicIndex !== -1) {
      newMusicSearchHistory.splice(sameMusicIndex, 1)
    }

    setMusicSearchHistory([musicData, ...newMusicSearchHistory])
    AsyncStorage.setItem('musicSearchHistory', JSON.stringify([musicData, ...newMusicSearchHistory]))
  }

  const removeMusicFromMusicSearchHistory = (spotifyId:string) => {
    const musicsIds = musicSearchHistory.map(item => (item.spotifyId))
    const musicIndex = musicsIds.indexOf(spotifyId)

    const newMusicSearchHistory = [...musicSearchHistory]
    newMusicSearchHistory.splice(musicIndex, 1)

    setMusicSearchHistory(newMusicSearchHistory)
    AsyncStorage.setItem('musicSearchHistory', JSON.stringify(newMusicSearchHistory))
  }

  return (
    <UserHistoryContext.Provider value={{ musicSearchHistory, addMusicToMusicSearchHistory, removeMusicFromMusicSearchHistory }}>
      {children}
    </UserHistoryContext.Provider>
  )
}

export default () => (useContext(UserHistoryContext))
