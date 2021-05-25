import * as RNFS from 'react-native-fs'

import { downloadedPlaylistsInfoSchema } from '../index'

import removeSpecialChars from '../../../utils/removeSpecialChars'

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
			currentPath: rootPath + removeSpecialChars(downloadedPlaylistsInfo[playlistId].playlistName),
			newPath: rootPath + removeSpecialChars(apiUpdatedPlaylists[playlistId].playlistName)
		}))

	await Promise.all(
		playlistsWithDifferentName.map(async playlist => {
			if (!await RNFS.exists(playlist.currentPath)) return

			await RNFS.mkdir(playlist.newPath)

			await Promise.all(
				(await RNFS.readDir(playlist.currentPath))
					.filter(possibleFile => possibleFile.isFile())
					.map(musicFile => ({
						currentPath: playlist.currentPath + '/' + musicFile.name,
						newPath: playlist.newPath + '/' + musicFile.name
					}))
					.map(async musicToMove => {
						await RNFS.moveFile(musicToMove.currentPath, musicToMove.newPath)
					})
			)

			await RNFS.unlink(playlist.currentPath)
		})
	)
}
