import * as RNFS from 'react-native-fs'

import { downloadedPlaylistsInfoSchema, downloadsInfoSchema } from '../index'

import removeSpecialChars from '../../../utils/removeSpecialChars'

export default async (
	downloadsInfo: downloadsInfoSchema,
	apiUpdatedPlaylists: downloadedPlaylistsInfoSchema
) => {
	await Promise.all(
		Object.keys(downloadsInfo).map(async path => {
			const playlistsOnPath = downloadsInfo[path]

			const playlistsIds = Object.keys(playlistsOnPath)

			const playlistsWithDifferentName = playlistsIds
				.filter(playlistId => {
					if (!playlistsOnPath[playlistId] || !apiUpdatedPlaylists[playlistId]) return false
					return playlistsOnPath[playlistId].playlistName !== apiUpdatedPlaylists[playlistId].playlistName
				})
				.map(playlistId => ({
					currentPath: path + removeSpecialChars(playlistsOnPath[playlistId].playlistName),
					newPath: path + removeSpecialChars(apiUpdatedPlaylists[playlistId].playlistName)
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
		})
	)
}
