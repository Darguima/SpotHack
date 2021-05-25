import * as RNFS from 'react-native-fs'
import removeSpecialChars from '../../../utils/removeSpecialChars'

import { downloadedPlaylistsInfoSchema } from '../index'

export default async (
	downloadedPlaylistsInfo: downloadedPlaylistsInfoSchema,
	apiUpdatedPlaylists: downloadedPlaylistsInfoSchema,
	rootPath: string
) => {
	const playlistsIdsNames = Object.keys(downloadedPlaylistsInfo)
		.map(playlistId => ({
			playlistId,
			playlistName: apiUpdatedPlaylists[playlistId].playlistName
		})
		)

	const playlistsOnRootPath = (await RNFS.readDir(rootPath))
		.filter(possibleDirectory => possibleDirectory.isDirectory())
		.map(possiblePlaylist => {
			return playlistsIdsNames.find(playlist => {
				return removeSpecialChars(playlist.playlistName) === possiblePlaylist.name
			})
		})
		.filter(possibleUndefined => possibleUndefined !== undefined) as {playlistId: string;playlistName: string;}[]
		// For some reason typescript don't consider this filter and say that the value is possible undefined

	const fileTree: downloadedPlaylistsInfoSchema[] =
	await Promise.all(
		playlistsOnRootPath
			.map(async playlist => {
				const filesNames = (await RNFS.readDir(rootPath + removeSpecialChars(playlist.playlistName)))
					.filter(possibleFile => possibleFile.isFile())
					.map(filesInfo => filesInfo.name)

				const tracks = apiUpdatedPlaylists[playlist.playlistId].tracks
					.filter(onlineMusic => filesNames.includes(removeSpecialChars(onlineMusic.youtubeQuery) + '.mp3'))

				return {
					[playlist.playlistId]: {
						playlistName: playlist.playlistName,
						tracks
					}
				}
			})
	)

	return Object.assign({}, ...fileTree)
}
