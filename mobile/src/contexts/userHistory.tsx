import AsyncStorage from '@react-native-community/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ImageSourcePropType } from 'react-native'

export interface musicsSpotifyResponseSchema {
	spotifyId: string,

	image: ImageSourcePropType,

	title: string,
	artists: string
}

export interface playlistsSpotifyResponseSchema {
	spotifyId: string,

	image: ImageSourcePropType,

	name: string,
	owner: string
}

interface UserHistoryContextData {
	musicSearchHistory: Array<musicsSpotifyResponseSchema>,
	addMusicToMusicSearchHistory: (musicData: musicsSpotifyResponseSchema) => void
	removeMusicFromMusicSearchHistory: (spotifyId:string) => void,

	playlistSearchHistory: Array<playlistsSpotifyResponseSchema>,
	addPlaylistToPlaylistSearchHistory: (playlistData: playlistsSpotifyResponseSchema) => void
	removePlaylistFromPlaylistSearchHistory: (spotifyId:string) => void

}

const UserHistoryContext = createContext<UserHistoryContextData>({} as UserHistoryContextData)

export const UserHistoryProvider: React.FC = ({ children }) => {
	// Music History

	const [musicSearchHistory, setMusicSearchHistory] = useState<Array<musicsSpotifyResponseSchema>>([])

	useEffect(() => {
		(async () => {
			const [[, musicSearchHistoryStored]] = await AsyncStorage.multiGet(['musicSearchHistory'])

			if (musicSearchHistoryStored) {
				setMusicSearchHistory(JSON.parse(musicSearchHistoryStored))
			}
		})()
	}, [])

	const addMusicToMusicSearchHistory = (musicData: musicsSpotifyResponseSchema) => {
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

	// Playlist History

	const [playlistSearchHistory, setPlaylistSearchHistory] = useState<Array<playlistsSpotifyResponseSchema>>([])

	useEffect(() => {
		(async () => {
			const [[, playlistSearchHistoryStored]] = await AsyncStorage.multiGet(['playlistSearchHistory'])

			if (playlistSearchHistoryStored) {
				setPlaylistSearchHistory(JSON.parse(playlistSearchHistoryStored))
			}
		})()
	}, [])

	const addPlaylistToPlaylistSearchHistory = (playlistData: playlistsSpotifyResponseSchema) => {
		const playlistsIds = playlistSearchHistory.map(item => (item.spotifyId))
		const samePlaylistIndex = playlistsIds.indexOf(playlistData.spotifyId)

		const newPlaylistSearchHistory = [...playlistSearchHistory]

		if (samePlaylistIndex !== -1) {
			newPlaylistSearchHistory.splice(samePlaylistIndex, 1)
		}

		setPlaylistSearchHistory([playlistData, ...newPlaylistSearchHistory])
		AsyncStorage.setItem('playlistSearchHistory', JSON.stringify([playlistData, ...newPlaylistSearchHistory]))
	}

	const removePlaylistFromPlaylistSearchHistory = (spotifyId:string) => {
		const playlistsIds = playlistSearchHistory.map(item => (item.spotifyId))
		const playlistIndex = playlistsIds.indexOf(spotifyId)

		const newPlaylistSearchHistory = [...playlistSearchHistory]
		newPlaylistSearchHistory.splice(playlistIndex, 1)

		setPlaylistSearchHistory(newPlaylistSearchHistory)
		AsyncStorage.setItem('playlistSearchHistory', JSON.stringify(newPlaylistSearchHistory))
	}

	return (
		<UserHistoryContext.Provider value={{
			musicSearchHistory,
			addMusicToMusicSearchHistory,
			removeMusicFromMusicSearchHistory,
			playlistSearchHistory,
			addPlaylistToPlaylistSearchHistory,
			removePlaylistFromPlaylistSearchHistory
		}}>
			{children}
		</UserHistoryContext.Provider>
	)
}

export default () => (useContext(UserHistoryContext))
