import * as RNFS from 'react-native-fs'

import { downloadedPlaylistsInfoSchema } from '../index'

import removeSpecialChars from '../../../utils/removeSpecialChars'

interface playlistsNamesUpdatedSchema {
	[key: string]: {
		currentName:string
		currentPath:string

		newName:string
		newPath:string

		playlistId: string,

		ytQueryOfMovedTracks: string[]
	}
}

export default async (
	downloadedPlaylistsInfo: downloadedPlaylistsInfoSchema,
	apiUpdatedPlaylists: downloadedPlaylistsInfoSchema,
	rootPath: string
) => {
	const playlistsIds = Object.keys(downloadedPlaylistsInfo)

	const playlistsWithDifferentName = playlistsIds
		.filter(playlistId => {
			return downloadedPlaylistsInfo[playlistId].playlistName !== apiUpdatedPlaylists[playlistId].playlistName
		})
		.map(playlistId => ({
			currentName: downloadedPlaylistsInfo[playlistId].playlistName,
			currentPath: rootPath + removeSpecialChars(downloadedPlaylistsInfo[playlistId].playlistName),

			newName: apiUpdatedPlaylists[playlistId].playlistName,
			newPath: rootPath + removeSpecialChars(apiUpdatedPlaylists[playlistId].playlistName),

			playlistId: playlistId
		}))

	const movedMusics: {[key: string]: string[]} = Object.assign({},
		...await Promise.all(
			playlistsWithDifferentName.map(async playlist => {
				await RNFS.mkdir(playlist.newPath)

				if (!await RNFS.exists(playlist.currentPath)) return { [playlist.playlistId]: [] }

				const movedMusics = await Promise.all(
					(await RNFS.readDir(playlist.currentPath))
						.filter(possibleFile => possibleFile.isFile())
						.map(musicFile => ({
							currentPath: playlist.currentPath + '/' + musicFile.name,
							newPath: playlist.newPath + '/' + musicFile.name,
							youtubeQuery: musicFile.name.replace('.mp3', '')
						}))
						.map(async musicToMove => {
							await RNFS.moveFile(musicToMove.currentPath, musicToMove.newPath)
							return musicToMove.youtubeQuery
						})
				)

				await RNFS.unlink(playlist.currentPath)

				return { [playlist.playlistId]: movedMusics }
			})
		)
	)

	const playlistsUpdated: playlistsNamesUpdatedSchema = {}

	for (const playlistIndex in playlistsWithDifferentName) {
		const playlistInfo = playlistsWithDifferentName[playlistIndex]

		playlistsUpdated[playlistInfo.playlistId] = {
			...playlistInfo,
			ytQueryOfMovedTracks: movedMusics[playlistInfo.playlistId]
		}
	}

	return playlistsUpdated
}
