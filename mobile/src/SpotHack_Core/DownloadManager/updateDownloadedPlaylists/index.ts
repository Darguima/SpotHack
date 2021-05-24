import { DownloadManager } from '../index'

import { ToastAndroid } from 'react-native'

import updatePlaylistsNames from './updatePlaylistsNames'

import spotifyApi from '../../../services/spotify/spotifyApi'

import convertArtistsArrayToString from '../../../utils/convertArtistsArrayToString'
import createYoutubeQuery from '../../../utils/createYoutubeQuery'
import removeSpecialChars from '../../../utils/removeSpecialChars'

export default async function (this: DownloadManager, currentRootPath: string) {
	const downloadedPlaylistsInfo = this.getDownloadedPlaylistsInfo()
	delete downloadedPlaylistsInfo['0']

	if (currentRootPath !== this.rootPath) return

	await Promise.all(
		Object.keys(downloadedPlaylistsInfo).map(async playlistId => {
			if (Object.keys(this.apiUpdatedPlaylists).includes(playlistId)) return
			const updatedPlaylist: SpotifyApi.PlaylistObjectFull = (await spotifyApi.get(`playlists/${playlistId}`)).data

			if (currentRootPath !== this.rootPath) return
			this.apiUpdatedPlaylists[playlistId] = {
				playlistName: updatedPlaylist.name,
				tracks: updatedPlaylist.tracks.items.map(({ track }) => ({
					spotifyId: track.id,
					title: track.name,
					artists: convertArtistsArrayToString(track.artists),
					youtubeQuery: createYoutubeQuery(convertArtistsArrayToString(track.artists), track.name)
				}))
			}
		}))

	if (currentRootPath !== this.rootPath) return

	const playlistsNamesUpdated = await updatePlaylistsNames(downloadedPlaylistsInfo, this.apiUpdatedPlaylists, currentRootPath)

	for (const playlistId in playlistsNamesUpdated) {
		const playlistUpdateInfo = playlistsNamesUpdated[playlistId]
		const playlistStored = downloadedPlaylistsInfo[playlistUpdateInfo.playlistId]

		playlistStored.playlistName = playlistUpdateInfo.newName

		playlistStored.tracks = playlistStored.tracks.filter(track => {
			return playlistUpdateInfo.ytQueryOfMovedTracks.includes(removeSpecialChars(track.youtubeQuery))
		})
	}

	await this.setDownloadedPlaylistsInfo(downloadedPlaylistsInfo, currentRootPath)

	this.arePlaylistsUpdatedValue = true
	ToastAndroid.show('Playlists Updated', ToastAndroid.SHORT)
}
